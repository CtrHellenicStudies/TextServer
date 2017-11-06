import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import db from '../db';

/**
 * An author of a work
 */
const Author = db.define('authors', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	english_name: {
		type: Sequelize.STRING,
	},
	original_name: {
		type: Sequelize.STRING,
	},
	slug: {
		type: Sequelize.STRING,
		unique: true,
	},
}, {
	timestamps: false,
});


Author.associate = ({ models }) => {
	Author.hasMany(models.works);
};

SequelizeSlugify.slugifyModel(Author, {
  source: ['english_name'],
  slugOptions: { lower: true },
  overwrite: false,
  column: 'slug'
});



export default Author;
