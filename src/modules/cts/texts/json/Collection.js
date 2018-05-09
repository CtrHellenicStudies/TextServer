import fs from 'fs';
import path from 'path';
import winston from 'winston';
import slugify from 'slugify';

import {
	getCltkCollectionUrn, getCltkTextgroupUrn, getCltkWorkUrn
} from '../../lib/getCltkUrns';
import { prepareModifiedSourceFiles } from '../../lib/ingestionUtils';

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
		this.source = null;
		this.sourceLink = null;
		this.urn = null;
		this.textGroups = [];
		this.works = [];
		this.urn = getCltkCollectionUrn(repoRemote);
	}

	/**
	 * Get the inventory of this collection's textGroups
	 */
	async generateInventory() {

		const sourceDir = `${this.repoLocal}/cltk_json/`;
		let collectionFiles = fs.readdirSync(sourceDir);

		// file change check
		collectionFiles = await prepareModifiedSourceFiles(collectionFiles, sourceDir);

		collectionFiles.forEach((filename) => {
			const jsonTextFile = fs.readFileSync(`${this.repoLocal}/cltk_json/${filename}`);
			const text = JSON.parse(jsonTextFile);

			// all cltk_json formatted texts should have source and sourceLink
			if ('source' in text && !this.source) {
				this.source = text.source;
			}
			if ('sourceLink' in text && !this.sourceLink) {
				this.sourceLink = text.sourceLink;
			}

			// some may have workUrn set, if so, infer specific urns (with data such
			// as tlg numbers) from that urn
			let textGroupUrn = '';
			let workUrn = '';
			if ('workUrn' in text) {
				// set work urn from context
				workUrn = text.workUrn;

				// set text urn from work
				let splitUrn = workUrn.split('.');
				splitUrn.pop();
				textGroupUrn = splitUrn.join('');

				// set collection urn from work
				splitUrn = workUrn.split(':');
				splitUrn.pop();
				this.urn = splitUrn.join(':');

			} else {
				textGroupUrn = getCltkTextgroupUrn(this.urn, text.author);
				workUrn = getCltkWorkUrn(this.urn, text.author, text.englishTitle);
			}

			// create a new textGroup
			if (!this.textGroups.some(textGroup => textGroup.title === text.author)) {
				const textGroup = new TextGroup({
					author: text.author,
					urn: textGroupUrn,
				});
				this.textGroups.push(textGroup);
			}

			// create a new work
			const work = new Work({
				urn: workUrn,
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
		const title = this.title;
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
		for (let i = 0; i < this.textGroups.length; i += 1) {
			await this.textGroups[i].save(collection); // eslint-disable-line
		}

		// ingest all works and textnodes
		for (let i = 0; i < this.works.length; i += 1) {
			await this.works[i].generateInventory(collection); // eslint-disable-line
		}
	}
}


export default _Collection;
