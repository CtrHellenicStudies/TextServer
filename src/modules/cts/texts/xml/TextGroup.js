import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';
import winston from 'winston';

import ctsNamespace from '../../lib/ctsNamespace';
import TextGroup from '../../../../models/textGroup';
import Work from './Work';
import { filterByModifiedSourceFile } from '../../lib/ingestionUtils';

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

		workDirs.forEach(async (workDir) => {
			// if the content object is a directory
			if (fs.lstatSync(path.join(this.textGroupDir, workDir)).isDirectory()) {

				if (!fs.existsSync(path.join(this.textGroupDir, workDir, '__cts__.xml'))) {
					return false;
				}

				const _workMetadataFile = fs.readFileSync(path.join(this.textGroupDir, workDir, '__cts__.xml'), 'utf8');
				const _workXML = new DOMParser().parseFromString(_workMetadataFile);
				let workContents = fs.readdirSync(path.join(this.textGroupDir, workDir));

				// file change check
				workContents = await filterByModifiedSourceFile(workContents.filter(workFile => !~workFile.indexOf('__cts__.xml')), path.join(this.textGroupDir, workDir));

				workContents.forEach((workContent) => {
					if (!~workContent.indexOf('__cts__.xml')) {
						// set filename and open file
						const filename = path.join(this.textGroupDir, workDir, workContent);

						// create a new work
						const work = new Work({
							filename,
							_workXML,
						});
						this.works.push(work);
					}
				});

			}
		});

		await this.save(collection);
	}

	/**
	 * Save all textgroup data and work/textNode data in this textgroup
	 */
	async save(collection) {
		const title = this.groupname || '';
		const urn = this.urn || '';

		// Save textGroup
		const textGroup = await TextGroup.create({
			title: title.slice(0, 250),
			urn: urn.slice(0, 250),
		});

		await textGroup.setCollection(collection);
		await collection.addTextgroup(textGroup);

		for (let i = 0; i < this.works.length; i += 1) {
			await this.works[i].generateInventory(textGroup); // eslint-disable-line
		}
	}
}

export default _TextGroup;
