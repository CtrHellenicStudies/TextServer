const fs = require('fs');
const path = require('path');

module.exports = {
	up: (queryInterface, Sequelize) => {
		const sql = fs.readFileSync(path.join(__dirname, '../seeders/textserver_tables_before_migrations.sql'), {encoding: 'utf8'});
		return queryInterface.sequelize.query(sql);
	},

	down: (queryInterface, Sequelize) => {
		const sql = `DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;`;
		return queryInterface.sequelize.query(sql);
	}
};
