import fs from 'fs';
import path from 'path';
import slugify from 'slugify';

import Collection from '../../../../models/collection';
import TextGroup from './TextGroup';


class _Collection {

	/**
	 * Create a collection
	 */
	constructor({ title, repoRemote, repoLocal, collectionDataType }) {
		this.title = title;
		this.repoRemote = repoRemote;
		this.repoLocal = repoLocal;
		this.collectionDataType = collectionDataType;
		this.textGroups = [];
	}

	/**
	 * Get the inventory of this collection's textGroups
	 */
	generateInventory() {

		const textGroupDirs = fs.readdirSync(`${this.repoLocal}/data/`);

		textGroupDirs.forEach(textGroupDir => {
			_textGroupMetadataFile = fs.readFileSync(`${this.repoLocal}/data/${textGroupDir}/__cts__.xml`);
			_textGroupXML = new DOMParser().parseFromString(_textGroupMetadataFile);

			// create a new textGroup
			const textGroup = new TextGroup(textGroupDir, _textGroupXML);

			// parse metadata about all works in textgroup
			textGroup.generateInventory()

			// add to collection textgroups array
			this.textGroups.push(textGroup);
		});

	}

	/**
	 * Save all textgroups in collection inventory (will save all hierarchical
	 * related data in the collection>>textgroup>>work>>textNode tree)
	 */
	ingest() {
		this.textGroups.forEach(textGroup => {
			textGroup.ingest();
		});
	}

}


export default _Collection;
