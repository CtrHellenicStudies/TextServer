import fs from 'fs';
import path from 'path';
import git from 'simple-git';
import slugify from 'slugify';
import dotenv from 'dotenv';
import winston from 'winston';
import { DOMParser } from 'xmldom';

import dotenvSetup from '../src/dotenv';
import db, { dbSetup } from '../src/db';


import Collection from '../src/modules/cts/texts/Collection';


/**
 * Clone a repository
 * TODO: determine optimal method of error handling with async/await
 */
const cloneRepo = async repository => {
	try {
		await git().clone(repository);
	} catch (e) {
		winston.info(` -- repo already cloned ${repository}`);
	}
}


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

/**
 * Parse data from a collection repo with XML data (possibly TEI-formatted
 * XML files with some CTS compliant files)
 */
const parseXmlData = ({ repoRemote, repoLocal, collectionDataType }) => {
	// create collection
	const collection = new Collection({
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
const parseJsonData = corpus => {
	// generate collection inventory

	// for each file, save collection, textgroup, work, version, exemplar

	// for each file, save textnode

}



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
	cloneRepo(repository, repository);

	// determine xml or cltk_json
	const isXmlCorpus = checkIsXmlCorpus(repository);
	if (isXmlCorpus) {
			parseXmlData({
				repoRemote: repository,
				repoLocal: _repositoryLocal,
				collectionDataType: 'xml',
			});
	} else {
			parseJsonData({
				repoRemote: repository,
				repoLocal: _repositoryLocal,
				collectionDataType: 'json',
			});
	}
});



/**
dotenvSetup();
dbSetup();

db.authenticate()
	.then(() => {
		db.sync();

		//
	})
	*/
