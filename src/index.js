import winston from 'winston';

import {app, db, listen} from './app';

// Connect to db and then start express listen
db.authenticate()
	.then(async () => {
		await db.sync();
		listen();
	})
	.catch(() => {
		winston.error(`Could not authenticate to database ${process.env.DB_NAME}`);
	});
