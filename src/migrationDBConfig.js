const dotenvSetup = require('./dotenv');

dotenvSetup();

module.exports = {
	development: {
		username: 'postgres',
		password: 'root',
		database: 'textserver',
		host: '127.0.0.1',
		dialect: 'postgres'
	},
	test: {
		username: 'runner',
		password: null,
		database: 'textserver_test',
		host: process.env.DB_HOST,
		dialect: 'postgres'
	},
	production: {
		username: null,
		password: null,
		database: null,
		host: null,
		dialect: 'postgres'
	}
};
