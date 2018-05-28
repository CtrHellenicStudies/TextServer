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
	const cltkGreekLit = { 
		title: 'The Center for Hellenic Studies Greek Texts',
		repoRemote: 'http://gitlab.archimedes.digital/archimedes/greek_text_chs',
		repoLocal: 'src/seeders/samples/greek_text_chs' 
	};
	const canonicalGreekLit = { 
		title: 'Canonical Greek Literature',
		repoRemote: 'https://github.com/PerseusDL/canonical-greekLit.git',
		repoLocal: 'src/seeders/samples/canonical-greekLit' 
	};
	const sampleRepo = [cltkGreekLit, canonicalGreekLit];

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
