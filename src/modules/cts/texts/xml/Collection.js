import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import { DOMParser } from 'xmldom';
import winston from 'winston';
import waterfall from 'async/waterfall';

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
	async generateInventory() {
		winston.info(` -- generating inventory for collection ${this.title}`);
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

				// add to collection textgroups array
				this.textGroups.push(textGroup);
			}
		});

		return await this.save();
	}

	/**
	 * Save all textgroups in collection inventory (will save all hierarchical
	 * related data in the collection>>textgroup>>work>>textNode tree)
	 */
	async save() {
		const collection = await Collection.create({
			title: this.title,
			repository: this.repoRemote,
		});

		for (let i = 0; i < this.textGroups.length; i++) {
			await this.textGroups[i].generateInventory(collection);
		}
	}
}

export default _Collection;
