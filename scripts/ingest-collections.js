import dotenv from 'dotenv';

import dotenvSetup from '../src/dotenv';
import * as models from '../src/models';
import db, { dbSetup } from '../src/db';
import { ingestCollections } from '../src/modules/cts';

// setup environment variables and db connection
dotenvSetup();
dbSetup();

db.authenticate()
	.then(() => {

		// sync database
		db.sync();

		// ingest collections
		ingestCollections();

		// close db connection
		db.close();
	});
