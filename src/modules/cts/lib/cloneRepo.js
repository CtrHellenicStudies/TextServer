import git from 'simple-git';
import winston from 'winston';


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


export default cloneRepo;
