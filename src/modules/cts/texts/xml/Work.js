import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { DOMParser, XMLSerializer } from 'xmldom';
import xmlJs from 'xml-js';
import xpath from 'xpath';
import winston from 'winston';
import crypto from 'crypto';
import _ from 'underscore';
import _s from 'underscore.string';


import ctsNamespace from '../../lib/ctsNamespace';
import {WORKTYPE_EDITION, WORKTYPE_TRANSLATION} from '../../lib/ctsConfig';
import Work from '../../../../models/work';
import Language from '../../../../models/language';
import Version from './Version';
import Translation from './Translation';
import Exemplar from './Exemplar';
import TextNode from './TextNode';
import RefsDecl from './RefsDecl';


/** Class representing a work in a textgroup */
class _Work {

	/**
	 * Create a new work
	 */
	constructor({ filename, _workXML }) {
		this._workXML = _workXML;
		this._workType = null;
		this._workTypeURN = null;
		this.label = null;
		this.description = null;
		this.filename = filename;
		this.english_title = null;
		this.original_title = null;
		this.urn = null;
		this.filemd5hash = null;
		this.structure = null;
		this.version = null;
		this.exemplar = null;
		this.refPatterns = [];
		this.refsDecls = [];
		this.textNodes = [];

		this._parseMetadataFromXml();
	}

	/**
	 * Parse metadata about this work from the input xml file
	 */
	_parseMetadataFromXml() {

		// urns
		const workElems = this._workXML.getElementsByTagNameNS(ctsNamespace, 'work');
		if (workElems && workElems.length) {
			this.urn = workElems[0].getAttributeNode('urn').value;
			this.textGroupUrn = workElems[0].getAttributeNode('groupUrn').value;
		} else {
			winston.info(`No information found about work ${this.filename}`);
		}

		// title
		const titleElems = this._workXML.getElementsByTagNameNS(ctsNamespace, 'title');
		if (titleElems && titleElems.length) {
			this.english_title = titleElems[0].firstChild.nodeValue;
			this.original_title = this.english_title;
		} else {
			winston.info(`No title found for work ${this.filename}`);
		}

		// parse type of this work from TEI.text.body.div.type and the urn variation according to its type
		try {
			this._parseWorkTypeProperties();
		} catch (err) {
			winston.info(`Unable to parse work type info for ${this.filename}`);
		}

		// create either edition or translation of the current work item according to its workType
		switch (this._workType) {
		case WORKTYPE_TRANSLATION:
			// translation, create and save this work's translation info
			this._createTranslation();
			break;
		case WORKTYPE_EDITION:
			// create and save this work's edition info (join for the moment as version)
			this._createEdition();
			break;
		default:
			break;
		}
	}

	/**
	 * Generate the inventory of the textNodes in the work
	 */
	async generateInventory(textGroup) {
		winston.info(` -- --  -- generating inventory for work ${this.english_title}`);
		const _workFile = fs.readFileSync(this.filename, 'utf8');

		// get hash of file
		this.filemd5hash = crypto.createHash('md5').update(_workFile).digest('hex');

		// parse as xml
		const _workFileXml = new DOMParser().parseFromString(_workFile);
		this._parseXMLFile(_workFileXml);


		return await this.save(textGroup);
	}

	/**
	 * Parse metadata and text nodes from the xml file of the work
	 */
	_parseXMLFile(_workFileXml) {
		this._getRefs(_workFileXml);

		if (!this.refPatterns.length) {
			winston.warn(`No ref patterns were identified for work ${this.filename}. Skipping`);
			return false;
		}

		this._getTextNodes(_workFileXml);
	}

	/**
	 * get ref patterns from the xml file
	 */
	_getRefs(_workFileXml) {
		const refsElems = _workFileXml.getElementsByTagName('refsDecl');

		if (!refsElems || !refsElems.length) {
			winston.warn(`No refs declaration found for work ${this.filename}. Skipping`);
			return false;
		}

		const patternElems = refsElems[0].getElementsByTagName('cRefPattern');
		if (!patternElems) {
			winston.warn(`Refs declaration found but no ref patterns found for work ${this.filename}. Skipping`);
			return false;
		}

		for (let i = 0; i < patternElems.length; i += 1) {
			const patternElem = patternElems[`${i}`];

			let label = '';
			const labelElem = patternElem.getAttributeNode('n');
			if (labelElem) {
				label = labelElem.value;
			}

			let matchPattern = '';
			const matchPatternElem = patternElem.getAttributeNode('matchPattern');
			if (matchPatternElem) {
				matchPattern = matchPatternElem.value;
			}

			let replacementPattern = '';
			const replacementPatternElem = patternElem.getAttributeNode('replacementPattern');
			if (replacementPatternElem) {
				replacementPattern = replacementPatternElem.value;
			}

			let description = '';
			const pElems = patternElem.getElementsByTagName('p');
			if (pElems && pElems.length) {
				description = pElems[0].firstChild.nodeValue;
			}

			this.refPatterns.push({
				label,
				matchPattern,
				replacementPattern,
				description,
			});
		}

		// order ref patterns by pattern length
		this.refPatterns = _.sortBy(this.refPatterns, pattern => pattern.replacementPattern.length);

		// make pattern label structure
		const patternLabels = [];
		this.refPatterns.forEach((refPattern, structureIndex) => {
			patternLabels.push(refPattern.label.replace('-', ''));

			// create RefsDecl objs for this work item
			const refsDecl = new RefsDecl({
				label: refPattern.label,
				description: refPattern.description,
				matchPattern: refPattern.matchPattern,
				replacementPattern: refPattern.replacementPattern,
				structureIndex: structureIndex,
				urn: this.urn
			});
			this.refsDecls.push(refsDecl);
		});

		this.structure = patternLabels.join('-');
	}

	/**
	 * get text nodes from the work xml file
	 */
	_getTextNodes(_workFileXml) {
		// query with tei namespace
		const queryWithNamespaces = xpath.useNamespaces({
			tei: 'http://www.tei-c.org/ns/1.0',
		});

		// text graph expressed as nodes and locations
		const text = [];

		// xml/html serializer
		const xmlSerializer = new XMLSerializer();

		// convert xml to text graph
		const xmlToGraph = (node, location) => {

			// localize current replacement pattern
			let replacementPattern;
			if (location.length) {
				replacementPattern = this._getReplacementPattern(
					this.refPatterns[location.length],
					this.refPatterns[location.length - 1],
				);
			} else {
				replacementPattern = this._getReplacementPattern(
					this.refPatterns[location.length],
				);
			}

			// query the current node with the current replacementPattern
			let nodeList = [];
			if (replacementPattern) {
				try {
					nodeList = queryWithNamespaces(replacementPattern, node);
				} catch (e) {
					return false;
				}
			}

			nodeList.forEach((_node, i) => {
				const _location = location.slice();
				_location.push(i + 1);

				// equivalent of innerHTML
				let html = '';
				for (const nodeKey in _node.childNodes) { // eslint-disable-line
					const nodeValue = xmlSerializer.serializeToString(_node.childNodes[nodeKey]);
					if (nodeValue && nodeValue !== '??') {
						html = `${html}${nodeValue} `;
					}
				}
				html = _s.trim(html);

					// serialize text node to text
				if (_location.length === this.refPatterns.length) {

						// push node to graph
					text.push({
						location: _location,
						html,
					});
				} else {

						// recurse
					const parsedNode = new DOMParser().parseFromString(html);
					xmlToGraph(parsedNode, _location);
				}
			});
		};

		// convert text to graph
		xmlToGraph(_workFileXml, []);

		// make textNodes from graph
		text.forEach(({ location, html }, index) => {
			const textNode = new TextNode({ location, html, index });
			this.textNodes.push(textNode);
		});
	}

	/**
	 * get replacementPattern from pattern
	 */
	_getReplacementPattern(pattern, prevPattern) {
		// remove xpath wrapper
		let replacementPattern = _s.lstrip(pattern.replacementPattern, '#xpath(');
		replacementPattern = _s.rstrip(replacementPattern, ')');

		// Don't only get the nodes that have n='number'
		// TODO: determine best method of handling numbering in the future
		// this is a workaround to get to a simple solution first
		const numberAttrQueryRegex = new RegExp(/\[@n='\$\d+'\]/g);
		replacementPattern = replacementPattern.replace(numberAttrQueryRegex, '');

		// localize more specific pattern by the nodes of the previous pattern
		if (prevPattern) {
			const prevReplacementPattern = this._getReplacementPattern(prevPattern);
			replacementPattern = replacementPattern.replace(prevReplacementPattern, '');
		}

		return replacementPattern;
	}

	/**
	 * retrieve work type and work type urn from TEI.text.body.div
	 */
	_parseWorkTypeProperties() {
		const _workFileContent = fs.readFileSync(this.filename, 'utf8');
		const _workJson = JSON.parse(xmlJs.xml2json(_workFileContent, {compact: true, spaces: 4}));
		const divNode = _workJson.TEI.text.body.div;
		let divAttr;

		// for cases of multiple divs
		if (Array.isArray(divNode)) {
			for (let i = 0; i < divNode.length; i += 1) {
				const div = divNode[`${i}`];
				if (div._attributes.n) {
					divAttr = div._attributes;
				}
			}
		} else {
			divAttr = divNode._attributes;
		}
		
		if (divAttr.type) {
			this._workType = divAttr.type;
		}
		if (divAttr.n) {
			this._workTypeURN = divAttr.n;
		}
	}

	/** 
	 * go through each edition elements in __cts__.xml and find the one that is the current work
	 * and create a Version for it, associating with the current Work model
	 */
	_createEdition() {
		const editionElems = this._workXML.getElementsByTagNameNS(ctsNamespace, 'edition');
		if (editionElems && editionElems.length) {

			for (let i = 0; i < editionElems.length; i += 1) {
				const editionElem = editionElems[`${i}`];

				const urnAttr = editionElem.getAttributeNode('urn');
				if (!urnAttr) {
					return false;
				}
				const urn = urnAttr.value;

				if (urn === this._workTypeURN) {
					this.version = new Version({
						urn,
						_versionXML: editionElem,
					});
				}
			}
		}
	}

	/**
	 * go through each translation elements in __cts__.xml, find the one that is the current work item
	 * and create a Translation model for it, associating with the current Work model
	 */
	_createTranslation() {
		// TODO: determine best how to handle translation data in the future
		const translationElems = this._workXML.getElementsByTagNameNS(ctsNamespace, 'translation');
		if (translationElems && translationElems.length) {

			// find the current work item
			for (let i = 0; i < translationElems.length; i += 1) {
				const translationElem = translationElems[`${i}`];

				// parse urn from urn, this is the urn with translation language code such as `-eng3`
				const urnAttr = translationElem.getAttributeNode('urn');
				if (!urnAttr) {
					return false;
				}
				const urn = urnAttr.value;

				if (urn === this._workTypeURN) {

					// parse label from label, later used as title for translation
					const labelElems = translationElem.getElementsByTagNameNS(ctsNamespace, 'label');
					let label;
					if (labelElems && labelElems.length) {
						label = labelElems[0].firstChild.nodeValue;
					}

					// parse description from description
					const descriptionElems = translationElem.getElementsByTagNameNS(ctsNamespace, 'description');
					let description;
					if (descriptionElems && descriptionElems.length) {
						description = descriptionElems[0].firstChild.nodeValue;
					}

					// construct Translation obj
					this.translation = new Translation({
						title: label, // using label as the title if nothing else fits better
						description: description,
						urn: urn,
					});
				}
			}
		}
	}

	/**
	 * Save all work data and textnodes in the work
	 */
	async save(textGroup) {

		const englishTitle = this.english_title;
		const originalTitle = this.original_title;
		if (!englishTitle || !originalTitle) {
			winston.error(`Error ingesting Work ${this.filename}`);
			return null;
		}

		const urn = this.urn || '';

		// Get Label and Description according to WorkItemType and FullURN
		[...this._workXML.getElementsByTagNameNS(ctsNamespace, this._workType)]
			.filter(metaEl => metaEl.getAttributeNode('urn').value === this._workTypeURN)
			.map((el) => {
				[...el.getElementsByTagNameNS(ctsNamespace, 'label')]
					.map((labelEl) => {
						this.label = labelEl.firstChild.nodeValue;
					});
				[...el.getElementsByTagNameNS(ctsNamespace, 'description')]
					.map((descriptionEl) => {
						this.description = descriptionEl.firstChild.nodeValue;
					});
			});

		// TODO: Add parsing of refs decl information from XML so that Work can self describe its document structure
		const work = await Work.create({
			filemd5hash: this.filemd5hash,
			filename: this.filename,
			original_title: originalTitle.slice(0, 250),
			english_title: englishTitle.slice(0, 250),
			structure: this.structure,
			form: this.form,
			urn: urn.slice(0, 250),
			work_type: this._workType,
			full_urn: this._workTypeURN,
			label: this.label,
			description: this.description,
		});

		await work.setTextgroup(textGroup);
		await textGroup.addWork(work);

		await this._createLanguage(work);

		if (this.version) {
			await this.version.save(work);
		}

		if (this.translation) {
			await this.translation.save(work);
		}

		for (let i = 0; i < this.textNodes.length; i += 1) {
			await this.textNodes[i].save(work); // eslint-disable-line
		}

		for (let i = 0; i < this.refsDecls.length; i += 1) {
			await this.refsDecls[i].save(work); // eslint-disable-line
		}
	}

	async _createLanguage(work) {
		let title;

		if (!this.filename) {
			return false;
		}

		if (~this.filename.indexOf('grc')) {
			title = 'Greek';
		} else if (~this.filename.indexOf('grk')) {
			title = 'Greek';
		} else if (~this.filename.indexOf('eng')) {
			title = 'English';
		} else if (~this.filename.indexOf('lat')) {
			title = 'Latin';
		} else if (~this.filename.indexOf('ger')) {
			title = 'German';
		} else if (~this.filename.indexOf('mul')) {
			title = 'Multiple';
		} else if (~this.filename.indexOf('fre')) {
			title = 'French';
		} else if (~this.filename.indexOf('cop')) {
			title = 'Coptic';
		} else {
			winston.error(`Could not identify language for file ${this.filename}`);
			return null;
		}

		let language;
		language = await Language.findOne({
			where: {
				title,
			}
		});

		if (!language) {
			language = await Language.create({
				title,
			});
		}

		await work.setLanguage(language);
		await language.addWork(work);
	}
}


export default _Work;
