import Sequelize from 'sequelize';
import _ from 'lodash';
import dotenvSetup from './dotenv';

// Get variables from dotenv
dotenvSetup();


const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;

/**
 * Sets up the MySQL connection based on the process.env settings.
 * @return {function} database
 */
const db = new Sequelize(
	DB_NAME,
	DB_USER,
	DB_PASS,
	{
		dialect: 'postgres',
		host: DB_HOST,
		port: DB_PORT || 5432,
		define: {
			timestamps: false,
			freezeTableName: true,
		},
		logging: false,
	}
);

const dbSetup = () => {
	// Setup associations for database
	Object.keys(db.models).forEach((modelName) => {
		if (db.models[modelName].associate) {
			db.models[modelName].associate(db);
		}
	});
};

export default db;
export { dbSetup };
