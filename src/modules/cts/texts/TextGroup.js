import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import xmldom from 'xmldom';
import xpath from 'xpath';


class _TextGroup {

	constructor(textGroupDir, _textGroupXML) {
		this.textGroupDir = this.textGroupDir;
		this._textGroupXML = _textGroupXML;
		this._parseMetadataFromXml();

		this.works = [];
	}

	/**
	 * parse metadata about this textgroup from the __cts__.xml input file
	 */
	_parseMetadataFromXml() {

	}

	/**
	 * Get the inventory of this textgroup's works
	 */
	generateInventory() {
		const workDirs = fs.readdirSync(this.textGroupDir);

		workDirs.forEach(workDir => {
			_workMetadataFile = fs.readFileSync(`${this.textGroupDir}/${workDir}/__cts__.xml`);
			_workXML = new DOMParser().parseFromString(_workMetadataFile);

			// create a new textGroup
			const work = new Work(workDir, _workXML);

			// parse metadata about work xml file textNodes
			work.generateInventory()

			this.works.push(work);
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
