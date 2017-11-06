import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import db from '../db';

/**
 * A textgroup in a collection
 */
const TextGroup = db.define('textgroups', {
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
	urn: {
		type: Sequelize.STRING,
	},
}, {
	timestamps: false,
});

TextGroup.associate = ({ models }) => {
	TextGroup.belongsTo(models.collections);
	TextGroup.hasMany(models.works);
};

SequelizeSlugify.slugifyModel(TextGroup, {
  source: ['title'],
  slugOptions: { lower: true },
  column: 'slug'
});


export default TextGroup;
