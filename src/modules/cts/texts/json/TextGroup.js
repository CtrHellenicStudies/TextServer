import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import xmldom from 'xmldom';
import xpath from 'xpath';

import TextGroup from '../../../../models/textGroup';


class _TextGroup {

	constructor({ author, urn }) {
		this.title = author;
		this.urn = urn;
		this._id = null;
		this.works = [];
	}

	/**
	 * Save all textgroup data and work/textNode data in this textgroup
	 */
	async save(collection) {
		const title = this.title || '';
		const urn = this.urn || '';

		const textGroup = await TextGroup.create({
			title: this.title,
			urn: this.urn,
		});

		await textGroup.setCollection(collection);
		await collection.addTextgroup(textGroup);
	}
}

export default _TextGroup;
