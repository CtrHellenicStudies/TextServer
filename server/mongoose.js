import mongoose from 'mongoose';

// Use native promises
mongoose.Promise = global.Promise;

const getURL = () => {
	const DB_HOST = process.env.DB_HOST;
	const DB_PORT = process.env.DB_PORT;
	const DB_NAME = process.env.DB_NAME;

	return `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
};

/**
 * Sets up the mongoose connection based on the process.env settings.
 * @return {[function]} mongoose connection instance
 */
const setupDB = () => {
	
	const url = getURL();

	const options = {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		},
	};

	return mongoose.connect(url, options).connection;
};

export default setupDB;
