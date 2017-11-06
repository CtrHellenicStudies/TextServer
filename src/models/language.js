import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import db from '../db';

/**
 * A language of a work
 */
const Language = db.define('languages', {
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
		// unique: true,
	},
}, {
	timestamps: false,
});

Language.associate = ({ models }) => {
	Language.hasMany(models.works);
};

SequelizeSlugify.slugifyModel(Language, {
  source: ['title'],
  slugOptions: { lower: true },
  overwrite: false,
  column: 'slug'
});


export default Language;
