import winston from 'winston';

import {
	Author, Collection, Exemplar, Language, TextGroup, TextNode, Version, Work,
} from './models';

import db from './db';

const dbTruncate = async () => {

	// destory all
	winston.info('Dropping all tables in database');
	await Author.destroy({
		where: {},
	});
	await Collection.destroy({
		where: {},
	});
	await Exemplar.destroy({
		where: {},
	});
	await Language.destroy({
		where: {},
	});
	await TextGroup.destroy({
		where: {},
	});
	await TextNode.destroy({
		where: {},
	});
	await Version.destroy({
		where: {},
	});
	await Work.destroy({
		where: {},
	});

	// close db
	return db.close();
};

/**
 * Create an Express.js wrapper that can be used for running tests against
 * @param {Application} app The Express.js Application that should be used to test against
 * @return {Object} configuration to pass to the GraphQL Tester for using this server
 */
export function create(app) {
	return {
		creator: port => new Promise((resolve, reject) => {
			const server = app.listen(port, () => {
				resolve({
					server: {
						shutdown: () => {
							server.close();
						}
					},
					url: `http://localhost:${port}`
				});
			});
		})
	};
}

export { dbTruncate };
