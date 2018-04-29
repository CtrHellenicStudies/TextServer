import dotenv from 'dotenv';
import winston from 'winston';

import dotenvSetup from '../src/dotenv';
import {
	Author, Collection, Exemplar, Language, TextGroup, TextNode, Version, Work,
} from '../src/models';
import db, { dbSetup } from '../src/db';

// setup environment variables and db connection
dotenvSetup();
dbSetup();

// safety belt
const expectedTestDBName = 'textserver_test';
if (db.connectionManager.config.database !== expectedTestDBName) {
	throw new Error('Not operating on test DB, terminated.');
}

db.authenticate()
	.then(async () => {

		// sync database
		const sync = await db.sync();

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
	});
