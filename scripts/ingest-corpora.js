import fs from 'fs';
import path from 'path';
import git from 'simple-git';
import slugify from 'slugify';
import dotenv from 'dotenv';
import winston from 'winston';

import dotenvSetup from '../src/dotenv';
import db, { dbSetup } from '../src/db';

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

const cloneRepo = async repository => {
	try {
		await git().clone(repository);
	} catch (e) {
		winston.info(` -- repo already cloned ${repository}`);
	}
}

winston.info('Cloning repositories');
_repositoriesJSON.repositories.forEach(repository => {
	winston.info(` -- cloning ${repository}`);
	cloneRepo(repository);
});

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

const parseXmlData = corpus => {
	// generate collection inventory

	// for each file, save collection, textgroup, work, version, exemplar

	// for each file, save textnode

}

const parseJsonData = corpus => {
	// generate collection inventory

	// for each file, save collection, textgroup, work, version, exemplar

	// for each file, save textnode

}

// walk corpora
const corpora = fs.readdirSync('.');
corpora.forEach(corpus => {

	// determine xml or cltk_json
	const isXmlCorpus = checkIsXmlCorpus(corpus);
	if (isXmlCorpus) {
			parseXmlData(corpus);
	} else {
			parseJsonData(corpus);
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
