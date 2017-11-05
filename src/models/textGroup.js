import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import db from '../db';

/**
 * A textgroup in a collection
 */
const TextGroup = db.define('textgroups', {
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
	ctsUrn: {
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
    overwrite: false,
    column: 'slug'
});


export default TextGroup;
