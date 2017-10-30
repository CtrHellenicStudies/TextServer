// main
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import fs from 'fs';
import path from 'path';
import request from 'request';
import dotenv from 'dotenv';

// middleware
import bodyParser from 'body-parser';
import session from 'express-session';
import logger from 'morgan';
import cookieParser from 'cookie-parser';

// db
import db, { dbSetup } from './db';

// webpack config
import config from '../webpack.config.js';

// dotenv
import dotenvSetup from './dotenv';

// authentication
import authSetup from './authentication';

// cors
import corsSetup from './cors';

// graphQL
import setupGraphql from './graphql';

// S3
import s3Setup from './s3';

// OAuth setup
import oauthSetup from './oauth';

// Routes
import authenticationRouter from './authentication/routes';


// environment variables setup
dotenvSetup();

const app = express();

const compiler = webpack(config);
const middleware = webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  contentBase: './src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});

app.use(middleware);
app.use(webpackHotMiddleware(compiler));


app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false,
}));

// session:
app.use(session({
	secret: process.env.SESSION_SECRET || 'secret',
	resave: false,
	saveUninitialized: false,
}));

// db setup
dbSetup();

// CORS setup
corsSetup(app);

// Authentication setup
authSetup(app);

// GraphQl setup
setupGraphql(app);

// S3 setup
s3Setup(app);

// OAuth setup
oauthSetup(app);

// Routes
app.use('/auth', authenticationRouter);

app.use(express.static('./public'));

app.get('*', function response (req, res) {
	// console.log(req);
  // res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')))
  // res.end()
	res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// App server listen
const APP_PORT = process.env.APP_PORT || 3000;
const listen = () => {
	app.listen(APP_PORT, () => {
	  console.log(`App is now running on http://localhost:${APP_PORT}`)
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
