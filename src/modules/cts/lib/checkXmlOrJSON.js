import fs from 'fs';
import path from 'path';

/**
 * Check if is xml or json data in the collection repo
 */
const checkXmlOrJSON = (collectionDir) => {
	const collectionFiles = fs.readdirSync(collectionDir);
	if (
			~collectionFiles.indexOf('data')
		&& !(~collectionFiles.indexOf('cltk_json'))
	) {
		return 'xml';
	}

	return 'json';
};


export default checkXmlOrJSON;
