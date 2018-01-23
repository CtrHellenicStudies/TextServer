import fs from 'fs';
import crypto from 'crypto';
import winston from 'winston';
import _s from 'underscore.string';

import { getCltkTextgroupUrn } from '../../lib/getCltkUrns';
import Language from '../../../../models/language';
import TextGroup from '../../../../models/textGroup';
import Work from '../../../../models/work';
import TextNode from './TextNode';
import Version from './Version';



/** Class representing a work in a textgroup */
class _Work {

	/**
	 * Create a new work
	 */
	constructor({ text, urn, filename }) {
		this.text = text;
		this.urn = urn;
		this.original_title = text.originalTitle || text.englishTitle;
		this.english_title = text.englishTitle;
		this.filename = filename;
		this.filemd5hash = crypto.createHash('md5').update(fs.readFileSync(filename, 'utf8')).digest('hex');

		// metadata about work
		this.language = text.language;
		this.structure = null;
		this.form = null;
		// edition information about work
		this.version = null;
		this.exemplar = null;
		this.translation = null;
		// textnodes for work
		this.textNodes = [];
	}

	/**
	 * Generate the inventory of the textNodes in the work
	 */
	async generateInventory(collection) {
		winston.info(` -- --  -- generating inventory for work ${this.english_title}`);

		const jsonToTextNodes = (node, location = []) => {
			for (const key in node) { // eslint-disable-line
				const _location = location.slice();
				_location.push(parseInt(key, 10));
				if (typeof node[key] === 'string') {
					this.textNodes.push(new TextNode({
						location: _location,
						text: node[key],
						filename: this.filename,
					}));
				} else {
					jsonToTextNodes(node[key], _location);
				}
			}
		};

		// convert json document body to textnodes
		jsonToTextNodes(this.text.text);

		// set edition version if edition in json
		if ('edition' in this.text) {
			let editionUrn = `${this.urn}`;

			// set edition urn from text metadata
			if (this.text.source === 'The Center for Hellenic Studies') {
				editionUrn = `${editionUrn}.chs`;
			}

			this.version = new Version({
				title: this.text.edition,
				urn: editionUrn,
			});
		}

		return await this.save(collection);
	}

	/**
	 * Save all work data and textnodes in the work
	 */
	async save(collection) {
		let textGroup = await TextGroup.findOne({
			where: {
				title: this.text.author,
			},
		});

		if (!textGroup) {
			textGroup = await TextGroup.create({
				title: this.language,
				urn: getCltkTextgroupUrn(collection.urn, this.text.author),
			});
		}

		const englishTitle = this.english_title;
		const originalTitle = this.original_title;
		if (!englishTitle || !originalTitle) {
			winston.error(`Error ingesting Work ${this.filename}`);
			return null;
		}

		const urn = this.urn || '';

		const work = await Work.create({
			filemd5hash: this.filemd5hash,
			filename: this.filename,
			original_title: originalTitle.slice(0, 255),
			english_title: englishTitle.slice(0, 255),
			structure: this.structure,
			form: this.form,
			urn: urn.slice(0, 255),
		});

		await work.setTextgroup(textGroup);
		await textGroup.addWork(work);

		await this._createLanguage(work);
		await this.version.save(work);

		// ingest all textnodes
		for (let i = 0; i < this.textNodes.length; i += 1) {
			await this.textNodes[i].save(i); // eslint-disable-line
		}
	}

	async _createLanguage(work) {

		let language;
		language = await Language.findOne({
			where: {
				title: _s.humanize(this.language),
			}
		});

		const _language = _s.humanize(this.language).trim();
		if (!language && _language.length) {
			language = await Language.create({
				title: _language,
			});
		}

		await work.setLanguage(language);
		await language.addWork(work);
	}
}


export default _Work;
