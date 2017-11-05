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
		this.work;
	}

	/**
	 * Save all information about the text node to the database
	 */
	ingest() {

	}

}

export default _TextNode;
