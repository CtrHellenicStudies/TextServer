
import TextNode from '../../../../models/textNode';
import Work from '../../../../models/work';


/** Class representing a text node or passage in a work */
class _TextNode {

	/**
	 * Create a new text node
	 */
	constructor({ location, text, filename }) {
		this.location = location;
		this.text = text;
		this.filename = filename;
		this.index;
	}

	/**
	 * Save all information about the text node to the database
	 */
	async save(index) {
		const work = await Work.findOne({ filename: this.filename });

		const textNode = await TextNode.create({
			index,
			location: this.location,
			text: this.text,
		});
		
		await textNode.setWork(work);
		await work.addTextnode(textNode);

		return textNode;
	}

}

export default _TextNode;
