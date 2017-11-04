import XMLCollection from '../texts/xml/Collection';
import JSONCollection from '../texts/xml/Collection';

/**
 * Parse data from a collection repo with XML data (possibly TEI-formatted
 * XML files with some CTS compliant files)
 */
const ingestXmlData = ({ repoRemote, repoLocal, collectionDataType }) => {
	// create collection
	const collection = new XMLCollection({
		repoRemote,
		repoLocal,
		collectionDataType,
	});

	// generate collection inventory
	collection.generateInventory();

	// save textnodes from all texts to database
	collection.ingestTexts();
}

/**
 * Parse data from a collection repo with cltk_json data
 */
const ingestJsonData = ({ repoRemote, repoLocal, collectionDataType }) => {
	// create collection
	const collection = new JSONCollection({
		repoRemote,
		repoLocal,
		collectionDataType,
	});

	// generate collection inventory
	collection.generateInventory();

	// save textnodes from all texts to database
	collection.ingestTexts();
}


export { ingestXmlData, ingestJsonData };
