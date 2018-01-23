import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';

import db from '../db';

/**
 * A translation of a work
 */
const Translation = db.define('translations', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
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
		type: Sequelize.TEXT,
	},
	urn: {
		type: Sequelize.STRING,
	},
}, {
	timestamps: false,
});

Translation.associate = ({ models }) => {
	Translation.belongsTo(models.works);
};

SequelizeSlugify.slugifyModel(Translation, {
	source: ['title'],
	slugOptions: { lower: true },
	column: 'slug'
});

export default Translation;
