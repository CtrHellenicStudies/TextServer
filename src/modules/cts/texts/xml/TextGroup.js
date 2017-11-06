import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';
import winston from 'winston';

import ctsNamespace from '../../lib/ctsNamespace';
import TextGroup from '../../../../models/TextGroup';
import Work from './Work';

class _TextGroup {

	constructor({ textGroupDir, _textGroupXML }) {
		this.textGroupDir = textGroupDir;
		this._textGroupXML = _textGroupXML;
		this.urn = '';
		this.groupname = '';
		this.works = [];

		this._parseMetadataFromXml();
	}

	/**
	 * parse metadata about this textgroup from the __cts__.xml input file
	 */
	_parseMetadataFromXml() {
		const textGroupElems = this._textGroupXML.getElementsByTagNameNS(ctsNamespace, 'textgroup');
		const groupNameElems = this._textGroupXML.getElementsByTagNameNS(ctsNamespace, 'groupname');
		this.urn = textGroupElems[0].getAttributeNode('urn').value;
		this.groupname = groupNameElems[0].firstChild.nodeValue;
	}

	/**
	 * Get the inventory of this textgroup's works
	 */
	generateInventory() {
		winston.info(` -- generating inventory for ${this.title}`);
		const workDirs = fs.readdirSync(this.textGroupDir);

		workDirs.forEach(workDir => {
			// if the content object is a directory
			if (fs.lstatSync(path.join(this.textGroupDir, workDir)).isDirectory()) {
				const _workMetadataFile = fs.readFileSync(path.join(this.textGroupDir, workDir, '__cts__.xml'), 'utf8');
				const _workXML = new DOMParser().parseFromString(_workMetadataFile);

				// create a new textGroup
				const work = new Work({
					workDir: path.join(this.textGroupDir, workDir),
					_workXML
				});

				// parse metadata about work xml file textNodes
				work.generateInventory()
				this.works.push(work);
			}
		});
	}

	/**
	 * Save all textgroup data and work/textNode data in this textgroup
	 */
	async ingest(collection) {
		winston.info(` -- ingesting texts for ${this.title}`);
		// Save textGroup
		const textGroup = await TextGroup.create({
			title: this.groupname,
			urn: this.urn,
		});

		await textGroup.setCollection(collection);

		this.works.forEach(async _work => {
			const work = await _work.ingest(textGroup);
			await textGroup.addWork(work);
		});

		return textGroup;
	}

}

export default _TextGroup;
