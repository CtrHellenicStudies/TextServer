import fs from 'fs';
import git from 'simple-git';
import winston from 'winston';


/**
 * Clone a repository
 * TODO: determine optimal method of error handling with async/await
 */
const cloneRepo = async (repository, repoLocal) => {
	if (!fs.existsSync(repoLocal)) {
		return await git().clone(repository, repoLocal);
	} else {
		winston.info(` -- repo already cloned at ${repositoryLOcal}`);
		return false;
	}
}


export default cloneRepo;
