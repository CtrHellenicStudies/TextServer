import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import db from '../db';

/**
 * A version of a work
 */
const Version = db.define('versions', {
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

Version.associate = ({ models }) => {
	Version.belongsTo(models.works);
};

SequelizeSlugify.slugifyModel(Version, {
	source: ['title'],
	slugOptions: { lower: true },
	column: 'slug'
});



export default Version;
