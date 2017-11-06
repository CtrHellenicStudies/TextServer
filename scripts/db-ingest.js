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

	try {
		return await ingestCollections();
	} catch (e) {
		winston.error(e);
		return 'Error with ingest. Aborting.';
	}
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
