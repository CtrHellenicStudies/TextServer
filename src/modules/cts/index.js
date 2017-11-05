import fs from 'fs';
import path from 'path';
import slugify from 'slugify';
import winston from 'winston';

import cloneRepo from './lib/cloneRepo';
import ingestCollection from './lib/ingestCollection';


const cloneRepos = async () => {
	const clonedRepos = [];
	const clonePromises = [];

	const repositoriesFile = fs.readFileSync(path.join('.', 'repositories.json'));
	const repositoriesJSON = JSON.parse(repositoriesFile);
	repositoriesJSON.repositories.forEach(async repository => {

		// set local repo path
		let repositoryLocal = repository.substring(repository.lastIndexOf('/'));
		repositoryLocal = path.join('./tmp/', repositoryLocal.replace(path.extname(repositoryLocal), ''));
		winston.info(` -- cloning ${repository} into ${repositoryLocal}`);

		// keep copy of all cloned repos' remote/local data
		clonedRepos.push({
			repoRemote: repository,
			repoLocal: repositoryLocal,
		});

		// clone repo
		clonePromises.push(cloneRepo(repository, repositoryLocal));
	});

	await Promise.all(clonePromises);
	return clonedRepos;
};


const ingestCollections = async () => {

	// setup tmp dir
	const dir = './tmp';
	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	// clone repos
	winston.info('Cloning repositories');
	const _clonedRepos = await cloneRepos();

	// Ingest collections from cloned repos
	winston.info('Ingesting texts and metadata');
	_clonedRepos.forEach(_clonedRepo => {

		// ingest data from texts in repo
		ingestCollection(_clonedRepo);
	});
}

export { ingestCollections };
