import fs from 'fs';

/**
 * Check if is xml or json data in the collection repo
 */
const checkXmlOrJSON = collection => {
	const collectionFiles = fs.readdirSync(collection);
	if (
			~collectionFiles.indexOf('data')
		&& !(~collectionFiles.indexOf('cltk_json'))
	) {
		return 'xml';
	}

	return 'json';
};


export default checkXmlOrJSON;
