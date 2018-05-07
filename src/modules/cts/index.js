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
	repositoriesJSON.repositories.forEach((repository) => {

		// set local repo path
		let repositoryLocal = repository.url.substring(repository.url.lastIndexOf('/'));
		repositoryLocal = path.join('./tmp/', repositoryLocal.replace(path.extname(repositoryLocal), ''));
		winston.info(` -- cloning ${repository.title} into ${repositoryLocal}`);

		// keep copy of all cloned repos' remote/local data
		clonedRepos.push({
			title: repository.title,
			repoRemote: repository.url,
			repoLocal: repositoryLocal,
		});

		// clone repo
		clonePromises.push(cloneRepo(repository.url, repositoryLocal));
	});

	await Promise.all(clonePromises);
	return clonedRepos;
};

/**
 * @param repos for manually specify repositories
 */
const ingestCollections = async (repos = []) => {

	// setup tmp dir
	const dir = './tmp';
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	let _clonedRepos;
	if (repos) {
		// use specified repos
		winston.info('Using specified repositories ...', repos);
		_clonedRepos = repos;
	} else {
		// clone repos
		winston.info('Cloning repositories');
		_clonedRepos = await cloneRepos();
	}
	

	// Ingest collections from cloned repos
	winston.info('Ingesting texts and metadata');
	for (let i = 0; i < _clonedRepos.length; i += 1) {
		winston.info(` -- ingesting for repo ${_clonedRepos[i].title} at ${_clonedRepos[i].repoLocal}`);
		
		// ingest data from texts in repo
		await ingestCollection(_clonedRepos[i]); // eslint-disable-line
	}
};

export { ingestCollections };
