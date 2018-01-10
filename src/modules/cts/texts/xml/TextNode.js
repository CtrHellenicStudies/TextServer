import winston from 'winston';
import _s from 'underscore.string';

import TextNode from '../../../../models/textNode';


/** Class representing a text node or passage in a work */
class _TextNode {

	/**
	 * Create a new text node
	 */
	constructor({ location, html, index }) {
		this.location = location;
		this.html = this._cleanHTML(html);
		this.index = index;
	}


	/**
	 * Clean HTML and continue adding rules here as required
	 */
	_cleanHTML(html) {

		let sanitized = html;

		sanitized = sanitized.replace(/-\\n/g, ' ');
		sanitized = sanitized.replace(/\\n|\\r\\n|\\r/g, '');
		sanitized = _s.clean(sanitized);


		return sanitized;
	}

	/**
	 * Save all information about the text node to the database
	 */
	async save(work) {
		const textNode = await TextNode.create({
			index: this.index,
			location: this.location,
			text: this.html,
		});

		await textNode.setWork(work);
		await work.addTextnode(textNode);

		return textNode;
	}
}

export default _TextNode;
