import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { DOMParser } from 'xmldom';
import xpath from 'xpath';

import TextGroup from '../../../../models/TextGroup';
import Work from './Work';

class _TextGroup {

	constructor({ textGroupDir, _textGroupXML }) {
		this.textGroupDir = textGroupDir;
		this._textGroupXML = _textGroupXML;
		this._parseMetadataFromXml();

		this.works = [];
	}

	/**
	 * parse metadata about this textgroup from the __cts__.xml input file
	 */
	_parseMetadataFromXml() {
		console.log("####################################");
		// console.log(this._textGroupXML);
		console.log("####################################");
	}

	/**
	 * Get the inventory of this textgroup's works
	 */
	generateInventory() {
		const workDirs = fs.readdirSync(this.textGroupDir);

		workDirs.forEach(workDir => {
			// if the content object is a directory
			if (fs.lstatSync(`${this.textGroupDir}/${workDir}`).isDirectory()) {
				const _workMetadataFile = fs.readFileSync(`${this.textGroupDir}/${workDir}/__cts__.xml`, 'utf8');
				const _workXML = new DOMParser().parseFromString(_workMetadataFile);

				// create a new textGroup
				const work = new Work(workDir, _workXML);

				// parse metadata about work xml file textNodes
				work.generateInventory()
				this.works.push(work);
			}
		});
	}

	/**
	 * Save all textgroup data and work/textNode data in this textgroup
	 */
	ingest() {
		// Save textGroup
		const textGroup = new TextGroup({

		});

		this.works.forEach(work => {
			work.ingest();
		});
	}

}

export default _TextGroup;
