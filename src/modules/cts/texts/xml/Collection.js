import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { DOMParser } from 'xmldom';
import winston from 'winston';

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
		this.id;
	}

	/**
	 * Get the inventory of this collection's textGroups
	 */
	generateInventory() {
		winston.info(` -- generating inventory for ${this.title}`);
		// walk contents of textgroup dir
		const textGroupContents = fs.readdirSync(path.join(this.repoLocal, '/data/'));
		textGroupContents.forEach((textGroupContent, i) => {

			// if the content object is a directory
			if (fs.lstatSync(path.join(this.repoLocal, '/data/', textGroupContent)).isDirectory()) {

				// check textgroup for __cts__.xml metadata file
				const _textGroupMetadataFile = fs.readFileSync(path.join(this.repoLocal, '/data/', textGroupContent, '/__cts__.xml'), 'utf8');

				// handle case of no __cts__.xml file
				if (!_textGroupMetadataFile) {
					winston.info(`No metadata file for ${path.join(this.repoLocal, '/data/', textGroupContent)}, skipping.`);
					return false;
				}

				// parse xml
				const _textGroupXML = new DOMParser().parseFromString(_textGroupMetadataFile);

				// create a new textGroup
				const textGroup = new TextGroup({
					textGroupDir: path.join(this.repoLocal, '/data/', textGroupContent),
					_textGroupXML,
				});

				// parse metadata about all works in textgroup
				textGroup.generateInventory()

				// add to collection textgroups array
				this.textGroups.push(textGroup);
			}
		});
	}

	/**
	 * Save all textgroups in collection inventory (will save all hierarchical
	 * related data in the collection>>textgroup>>work>>textNode tree)
	 */
	async ingest() {
		winston.info(` -- ingesting texts for ${this.title}`);

		const collection = await Collection.create({
			title: this.title,
			repository: this.repoRemote,
		});

		this.textGroups.forEach(async _textGroup => {
			const textGroup = await _textGroup.ingest(collection);
			await collection.addTextgroup(textGroup);
		});

		return collection;
	}
}

export default _Collection;
