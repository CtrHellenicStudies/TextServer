import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import db from '../db';

/**
 * A collection of texts, represented in the form of a git repository
 */
const Collection = db.define('collections', {
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
	repository: {
		type: Sequelize.STRING,
	},
}, {
	timestamps: false,
});

Collection.associate = ({ models }) => {
	Collection.hasMany(models.textgroups);
};

SequelizeSlugify.slugifyModel(Collection, {
  source: ['title'],
  slugOptions: { lower: true },
  column: 'slug'
});


export default Collection;
