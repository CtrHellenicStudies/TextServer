import fs from 'fs';

/**
 * Check if is xml or json data in the collection repo
 */
const checkXmlOrJSON = corpus => {
	const corpusFiles = fs.readdirSync(corpus);
	if (
			~corpusFiles.indexOf('data')
		&& !(~corpusFiles.indexOf('cltk_json'))
	) {
		return true;
	}

	return false;
};

export default checkXmlOrJSON;
