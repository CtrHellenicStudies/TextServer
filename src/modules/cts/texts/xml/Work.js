import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { DOMParser, XMLSerializer } from 'xmldom';
import xpath from 'xpath';
import winston from 'winston';
import crypto from 'crypto';
import _ from 'underscore';
import _s from 'underscore.string';


import ctsNamespace from '../../lib/ctsNamespace';
import Work from '../../../../models/work';
import Language from '../../../../models/language';
import Version from './Version';
import Exemplar from './Exemplar';
import TextNode from './TextNode';


/** Class representing a work in a textgroup */
class _Work {

	/**
	 * Create a new work
	 */
	constructor({ filename, _workXML }) {
		this._workXML = _workXML;
		this.filename = filename;
		this.english_title;
		this.original_title;
		this.urn;
		this.filemd5hash;
		this.structure;
		this.version;
		this.exemplar;
		this.refPatterns = [];
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

		// edition (join for the moment as version)
		const editionElems = this._workXML.getElementsByTagNameNS(ctsNamespace, 'edition');
		if (editionElems && editionElems.length) {
			const urnAttr = editionElems[0].getAttributeNode('urn');
			if (!urnAttr) {
				return false;
			}
			const urn = urnAttr.value;
			this.version = new Version({
				urn,
				_versionXML: editionElems[0],
			});
		}

		// translation
		// TODO: determine best how to handle translation data in the future
		const translationElems = this._workXML.getElementsByTagNameNS(ctsNamespace, 'translation');
		if (translationElems && translationElems.length) {
			const labelElems = translationElems[0].getElementsByTagNameNS(ctsNamespace, 'label');
			const descriptionElems = translationElems[0].getElementsByTagNameNS(ctsNamespace, 'description');
			let label;
			let description;

			if (labelElems && labelElems.length) {
				label = labelElems[0].firstChild.nodeValue;
			}

			if (descriptionElems && descriptionElems.length) {
				description = descriptionElems[0].firstChild.nodeValue;
			}

			this.translation = {
				label,
				description,
			};
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

		for (let i = 0; i < patternElems.length; i++) {
			let patternElem = patternElems[`${i}`];

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
		this.refPatterns = _.sortBy(this.refPatterns, (pattern) => { return pattern.replacementPattern.length });

		// make pattern label structure
		const patternLabels = [];
		this.refPatterns.forEach(refPattern => {
			patternLabels.push(refPattern.label.replace('-', ''));
		});
		this.structure = patternLabels.join('-');
	}

	/**
	 * get text nodes from the work xml file
	 */
	_getTextNodes(_workFileXml) {
		// query with tei namespace
		const queryWithNamespaces = xpath.useNamespaces({
			"tei": "http://www.tei-c.org/ns/1.0",
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
					nodeList = queryWithNamespaces(replacementPattern, node)
				} catch (e) {
					return false;
				}
			}

			nodeList.forEach((_node, i) => {
					const _location = location.slice();
					_location.push(i);

					// equivalent of innerHTML
					let html = '';
					for (let nodeKey in _node.childNodes) {
						let nodeValue = xmlSerializer.serializeToString(_node.childNodes[nodeKey])
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
						let parsedNode = new DOMParser().parseFromString(html);
						xmlToGraph(parsedNode, _location);
					}
				});
		}

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
	 * Save all work data and textnodes in the work
	 */
	async save(textGroup) {
		const work = await Work.create({
			filemd5hash: this.filemd5hash,
			filename: this.filename,
			original_title: this.original_title,
			english_title: this.english_title,
			structure: this.structure,
			form: this.form,
			urn: this.urn,
		})

		await work.setTextgroup(textGroup);
		await textGroup.addWork(work);

		await this._createLanguage(work);

		if (this.version) {
			await this.version.save(work);
		}

		for (let i = 0; i < this.textNodes.length; i++) {
			await this.textNodes[i].save(work);
		}

	}

	async _createLanguage(work) {
		let title;

		if (!this.filename) {
			return false;
		}

		if (~this.filename.indexOf('grc')) {
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
		} else {
			winston.error(`Could not identify language for file ${this.filename}`);
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
			})
		}

		await work.setLanguage(language);
		await language.addWork(work);
	}
}


export default _Work;
