// main
import express from 'express';
import fs from 'fs';
import request from 'request';

// middleware
import bodyParser from 'body-parser';
import session from 'express-session';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

// db
import db, { dbSetup } from './db';

// dotenv
import dotenvSetup from './dotenv';

// authentication
import authSetup from './authentication';

// cors
import corsSetup from './cors';

// graphQL
import setupGraphql from './graphql';

// Routes
import authenticationRouter from './authentication/routes';


// environment variables setup
dotenvSetup();

const app = express();

app.set('port', (process.env.PORT || 3001));

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false,
}));

// db setup
dbSetup();

// CORS setup
corsSetup(app);

// GraphQl setup
setupGraphql(app);

// OAuth setup
oauthSetup(app);

// Routes
app.use('/auth', authenticationRouter);

// App server listen
const listen = () => {
	app.listen(app.get('port'), () => {
		console.info(`App is now running on http://localhost:${APP_PORT}`);
	});
};

// Connect to db and then start express listen
db.authenticate()
	.then(() => {
		db.sync();

		listen();
	})
	.catch(() => {
		console.error(`Could not authenticate to database ${process.env.DB_NAME}`);
	});
