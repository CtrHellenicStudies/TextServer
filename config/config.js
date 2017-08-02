require('dotenv').config();

const {
	DATABASE_URL,
	DB_HOST,
	DB_NAME,
	DB_PASS,
	DB_PORT,
	DB_USER,
} = process.env;

const config = {
	production: {
		dialect: 'postgres',
		url: DATABASE_URL,
	},
};

if (typeof DATABASE_URL !== 'undefined') {
	config.development = {
		dialect: 'postgres',
		url: DATABASE_URL,
	};

	config.test = {
		dialect: 'postgres',
		url: DATABASE_URL,
	};
} else {
	config.development = {
		username: DB_USER || null,
		password: DB_PASS || null,
		database: DB_NAME || 'texts_development',
		host: DB_HOST || '127.0.0.1',
		dialect: 'postgres'
	};

	config.test = {
		username: DB_USER || null,
		password: DB_PASS || null,
		database: DB_NAME || 'texts_test',
		host: DB_HOST || '127.0.0.1',
		dialect: 'postgres'
	};
}

module.exports = config;
