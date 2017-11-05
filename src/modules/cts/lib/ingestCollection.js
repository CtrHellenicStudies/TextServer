import checkXmlOrJSON from './checkXmlOrJSON';
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
	collection.ingest();
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
	collection.ingest();
}

/**
 * Ingest a collection representated as git repository that has been cloned
 */
const ingestCollection = ({ repoRemote, repoLocal }) => {
	// determine xml or cltk_json
	const xmlOrJSON = checkXmlOrJSON(repoLocal);
	if (xmlOrJSON === 'xml') {
		ingestXmlData({
			repoRemote,
			repoLocal,
			collectionDataType: 'xml',
		});
	} else if (xmlOrJSON === 'json'){
		ingestJsonData({
			repoRemote,
			repoLocal,
			collectionDataType: 'json',
		});
	}
}


export { ingestXmlData, ingestJsonData };
export default ingestCollection;
