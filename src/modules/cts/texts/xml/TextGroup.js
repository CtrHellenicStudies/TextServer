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
	async generateInventory(collection) {
		winston.info(` -- -- generating inventory for textgroup ${this.groupname}`);
		const workDirs = fs.readdirSync(this.textGroupDir);

		workDirs.forEach(workDir => {
			// if the content object is a directory
			if (fs.lstatSync(path.join(this.textGroupDir, workDir)).isDirectory()) {
				const _workMetadataFile = fs.readFileSync(path.join(this.textGroupDir, workDir, '__cts__.xml'), 'utf8');
				const _workXML = new DOMParser().parseFromString(_workMetadataFile);

				// create a new work
				const work = new Work({
					workDir: path.join(this.textGroupDir, workDir),
					_workXML
				});

				this.works.push(work);
			}
		});

		await this.save(collection);
	}

	/**
	 * Save all textgroup data and work/textNode data in this textgroup
	 */
	async save(collection) {
		// Save textGroup
		const textGroup = await TextGroup.create({
			title: this.groupname,
			urn: this.urn,
		});

		await textGroup.setCollection(collection);
		await collection.addTextgroup(textGroup);

		for (let i = 0; i < this.works.length; i++) {
			await this.works[i].generateInventory(textGroup);
		}
	}
}

export default _TextGroup;
