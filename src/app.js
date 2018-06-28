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
import * as models from './models';
import db, { dbSetup } from './db';

// dotenv
import dotenvSetup from './dotenv';

// authentication
// import authSetup from './authentication';

// Health Check

import healthCheck from './healthCheck';

// cors
import corsSetup from './cors';

// graphQL
import setupGraphql from './graphql';

// Routes
// import authenticationRouter from './authentication/routes';


// environment variables setup
dotenvSetup();

const app = express();

app.set('port', (process.env.PORT || 3003));

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

// Routes
// app.use('/auth', authenticationRouter);
app.use('/', healthCheck);

// App server listen
const listen = () => {
	app.listen(app.get('port'), () => {
		console.info(`App is now running on http://localhost:${app.get('port')}`);
	});
};

export {app, db, listen};
