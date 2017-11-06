import winston from 'winston';
import TextNode from '../../../../models/textNode';


/** Class representing a text node or passage in a work */
class _TextNode {

	/**
	 * Create a new text node
	 */
	constructor({ location, html, index }) {
		this.location = location;
		this.html = html;
		this.index = index;
	}

	/**
	 * Save all information about the text node to the database
	 */
	async save(work) {
		const textNode = await TextNode.create({
			index: this.index,
			location: this.location,
			text: this.html,
		})

		await textNode.setWork(work);
		await work.addTextnode(textNode);

		return textNode;
	}
}

export default _TextNode;
