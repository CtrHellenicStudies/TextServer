import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';


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

	}

	/**
	 * Save all work data and textnodes in the work
	 */
	ingest() {

	}

}


export default _Work;
