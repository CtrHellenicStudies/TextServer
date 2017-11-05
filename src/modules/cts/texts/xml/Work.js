import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';
import winston from 'winston';


import ctsNamespace from '../../lib/ctsNamespace';
import Work from '../../../../models/work';
import Version from './Version';
import Exemplar from './Exemplar';
import TextNode from './TextNode';


/** Class representing a work in a textgroup */
class _Work {

	/**
	 * Create a new work
	 */
	constructor({ workDir, _workXML }) {
		this.workDir = workDir;
		this._workXML = _workXML;
		this.title;
		this.urn;
		this.groupUrn;
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
			winston.info(`No information found about work ${this.workDir}`);
		}

		// title
		const titleElems = this._workXML.getElementsByTagNameNS(ctsNamespace, 'title');
		if (titleElems && titleElems.length) {
			this.title = titleElems[0].firstChild.nodeValue;
		} else {
			winston.info(`No title found for work ${this.workDir}`);
		}

		// edition (join for the moment as version)
		const editionElems = this._workXML.getElementsByTagNameNS(ctsNamespace, 'edition');
		if (editionElems && editionElems.length) {
			this.version = new Version({
				workUrn: this.urn,
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
	generateInventory() {
		const workContents = fs.readdirSync(this.workDir);

		workContents.forEach(workContent => {
			if (!~workContent.indexOf('__cts__.xml')) {
				const _workFile = fs.readFileSync(path.join(this.workDir, workContent), 'utf8');
				const _workFileXml = new DOMParser().parseFromString(_workFile);
				this._parseXMLFile(_workFileXml);
			}
		});

	}

	/**
	 * Parse metadata and text nodes from the xml file of the work
	 */
	_parseXMLFile(_workFileXml) {

		const refsElems = _workFileXml.getElementsByTagName('refsDecl');

		if (refsElems && refsElems.length) {
			const patternElems = refsElems[0].getElementsByTagName('cRefPattern');
			if (patternElems) {
				for (let i = 0; i < patternElems.length; i++) {
					let patternElem = patternElems[`${i}`];
					const label = patternElem.getAttributeNode('n');
					const matchPattern = patternElem.getAttributeNode('matchPattern');
					const replacementPattern = patternElem.getAttributeNode('replacementPattern');

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
			} else {
				winston.warn(`Refs declaration found but no ref patterns found for work ${this.workDir}. Skipping`);
				return false;
			}

		} else {
			winston.warn(`No refs declaration found for work ${this.workDir}. Skipping`);
			return false;
		}

	}

	/**
	 * Save all work data and textnodes in the work
	 */
	ingest() {

	}

}


export default _Work;
