import checkXmlOrJSON from './checkXmlOrJSON';
import XMLCollection from '../texts/xml/Collection';
import JSONCollection from '../texts/json/Collection';

/**
 * Parse data from a collection repo with XML data (possibly TEI-formatted
 * XML files with some CTS compliant files)
 */
const ingestXmlData = async ({ title, repoRemote, repoLocal, collectionDataType }) => {
	// create collection
	const collection = new XMLCollection({
		title,
		repoRemote,
		repoLocal,
		collectionDataType,
	});

	// generate collection inventory
	await collection.generateInventory();
}

/**
 * Parse data from a collection repo with cltk_json data
 */
const ingestJsonData = async ({ title, repoRemote, repoLocal, collectionDataType }) => {
	// create collection
	const collection = new JSONCollection({
		title,
		repoRemote,
		repoLocal,
		collectionDataType,
	});

	// generate collection inventory
	await collection.generateInventory();
}

/**
 * Ingest a collection representated as git repository that has been cloned
 */
const ingestCollection = async ({ title, repoRemote, repoLocal }) => {
	// determine xml or cltk_json
	const xmlOrJSON = checkXmlOrJSON(repoLocal);
	if (xmlOrJSON === 'xml') {
		await ingestXmlData({
			title,
			repoRemote,
			repoLocal,
			collectionDataType: 'xml',
		});
	} else if (xmlOrJSON === 'json'){
		await ingestJsonData({
			title,
			repoRemote,
			repoLocal,
			collectionDataType: 'json',
		});
	}
}


export { ingestXmlData, ingestJsonData };
export default ingestCollection;
