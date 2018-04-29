import dotenv from 'dotenv';
import winston from 'winston';

import dotenvSetup from '../src/dotenv';
import * as models from '../src/models';
import db, { dbSetup } from '../src/db';
import { ingestCollections } from '../src/modules/cts';

// setup environment variables and db connection
dotenvSetup();
dbSetup();

const ingest = async () => {
	let ingestResult;

	// minimal sample text resource for running currently implemented tests
	const sampleRepo = [{ 
		title: 'The Center for Hellenic Studies Greek Texts - Test Sample',
		repoRemote: '',
		repoLocal: 'src/seeders/samples/greek_text_chs' 
	}];

	try {
		return await ingestCollections(sampleRepo);
	} catch (e) {
		winston.error(e);
		return 'Error with ingest. Aborting.';
	}
};

// safety belt
const expectedTestDBName = 'textserver_test';
if (db.connectionManager.config.database !== expectedTestDBName) {
	throw new Error('Not operating on test DB, terminated.');
}

db.authenticate()
	.then(async () => {
		// sync database
		const sync = await db.sync();

		// run ingest
		winston.info('Beginning ingest of designated repositories');
		const ingestResult = await ingest();
		winston.info(ingestResult);

		// close db
		db.close();
	});
