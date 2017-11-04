import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import winston from 'winston';

import checkXmlOrJSON from './lib/checkXmlOrJSON';
import cloneRepo from './lib/cloneRepo';
import { ingestXmlData, ingestJsonData } from './lib/ingestTexts';


const ingestCollections = () => {

	// setup tmp dir
	const dir = './tmp';
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	// change to dir to clone repos
	process.chdir('./tmp');

	// clone repos
	const _repositoriesFile = fs.readFileSync(path.join('..', 'repositories.json'));
	const _repositoriesJSON = JSON.parse(_repositoriesFile);

	winston.info('Cloning repositories');
	_repositoriesJSON.repositories.forEach(repository => {
		winston.info(` -- cloning ${repository}`);

		let _repositoryLocal = repository.substring(repository.lastIndexOf('/'));
		_repositoryLocal = path.join('.', _repositoryLocal.replace(path.extname(_repositoryLocal), ''));
		cloneRepo(repository, repository);

		// determine xml or cltk_json
		const xmlOrJSON = checkXmlOrJSON(_repositoryLocal);
		if (xmlOrJSON === 'xml') {
				ingestXmlData({
					repoRemote: repository,
					repoLocal: _repositoryLocal,
					collectionDataType: 'xml',
				});
		} else if (xmlOrJSON === 'json'){
				ingestJsonData({
					repoRemote: repository,
					repoLocal: _repositoryLocal,
					collectionDataType: 'json',
				});
		}
	});
}

export { ingestCollections };
