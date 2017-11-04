import Sequelize from 'sequelize';
import db from '../db';

/**
 * A collection of texts, represented in the form of a git repository
 */
const Collection = db.define('collections', {
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
	repositoryURL: {
		type: Sequelize.STRING,
	},
}, {
		timestamps: false,
		tableName: 'collections',
});

Collection.associate = ({ models }) => {
	Collection.hasMany(models.works);
};


export default Collection;
