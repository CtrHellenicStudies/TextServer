import dotenv from 'dotenv';
import winston from 'winston';

import dotenvSetup from '../src/dotenv';
import * as Models from '../src/models';
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
		await Promise.all(Object.keys(Models).map(async (modelName) => {
			await Models[modelName].destroy({
				where: {},
			});
		}));

		// close db
		return db.close();
	});
