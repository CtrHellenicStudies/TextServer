import Sequelize from 'sequelize';
import db from '../db';

/**
 * A version of a work
 */
const Version = db.define('versions', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	title: {
		type: Sequelize.STRING,
	},
	slug: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: {
		type: Sequelize.STRING,
	},
}, {
	timestamps: false,
});

Version.associate = ({ models }) => {
	Version.belongsTo(models.works);
};


export default Version;
