import dotenv from 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';

// middleware
import bodyParser from 'body-parser';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';

// mongoDB
import db from './postgres';

import RootSchema from './rootSchema';

const app = express();

app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.use(bodyParser.json());

// CORS-enabled GraphQL server
app.use('/graphql', cors(), graphqlHTTP({
	schema: RootSchema,
	graphiql: true
}));

function listen() {
	app.listen(app.get('port'), () => {
		console.info(`Application listening on port ${app.get('port')}`);
	});
}

db.authenticate()
	.then(() => {
		db.sync();

		listen();
	})
	.catch(() => {
		console.error(`Could not authenticate to database ${process.env.DB_NAME}`);
	});
