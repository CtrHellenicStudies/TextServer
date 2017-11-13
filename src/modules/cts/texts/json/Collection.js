import fs from 'fs';
import path from 'path';
import winston from 'winston';
import slugify from 'slugify';

import {
	getCltkCollectionUrn, getCltkTextgroupUrn, getCltkWorkUrn
} from '../../lib/getCltkUrns';

import Collection from '../../../../models/collection';
import TextGroup from './TextGroup';
import Work from './Work';


class _Collection {

	/**
	 * Create a collection
	 */
	constructor({ title, repoRemote, repoLocal, collectionDataType }) {
		this.title = title;
		this.repoRemote = repoRemote;
		this.repoLocal = repoLocal;
		this.collectionDataType = collectionDataType;
		this.source;
		this.sourceLink;
		this.urn;
		this.textGroups = [];
		this.works = [];
		this.urn = getCltkCollectionUrn(repoRemote);
	}

	/**
	 * Get the inventory of this collection's textGroups
	 */
	async generateInventory() {

		const collectionFiles = fs.readdirSync(`${this.repoLocal}/cltk_json/`);

		collectionFiles.forEach(filename => {
			const jsonTextFile = fs.readFileSync(`${this.repoLocal}/cltk_json/${filename}`);
			const text = JSON.parse(jsonTextFile);

			// all cltk_json formatted texts should have source and sourceLink
			if ('source' in text && !this.source) {
				this.source = text.source;
			}
			if ('sourceLink' in text && !this.sourceLink) {
				this.sourceLink = text.sourceLink;
			}

			// create a new textGroup
			if (!this.textGroups.some(textGroup => {
				return textGroup.title === text.author;
			})) {
				const textGroup = new TextGroup({
					author: text.author,
					urn: getCltkTextgroupUrn(this.urn, text.author),
				});
				this.textGroups.push(textGroup);
			}

			// create a new work
			const work = new Work({
				urn: getCltkWorkUrn(this.urn, text.author, text.englishTitle),
				text,
				filename: `${this.repoLocal}/cltk_json/${filename}`,
			});
			this.works.push(work);
		});

		return await this.save();
	}

	/**
	 * Save all textgroups in collection inventory (will save all hierarchical
	 * related data in the collection>>textgroup>>work>>textNode tree)
	 */
	async save() {
		let title = this.title;
		if (!this.title) {
			winston.error(`Error ingesting Collection ${this.repoLocal}`);
			return false;
		}

		const collection = await Collection.create({
			title: title.slice(0, 250),
			repository: this.repoRemote,
			urn: this.urn,
		});

		// ingest all textGroups
		for (let i = 0; i < this.textGroups.length; i++) {
			await this.textGroups[i].save(collection);
		}

		// ingest all works and textnodes
		for (let i = 0; i < this.works.length; i++) {
			await this.works[i].generateInventory(collection);
		}
	}
}


export default _Collection;
