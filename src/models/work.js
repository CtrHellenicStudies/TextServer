import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import db from '../db';

/**
 * A work in a textgroup, represented as a file in a git repository
 */
const Work = db.define('works', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	filemd5hash: {
		type: Sequelize.STRING,
	},
	filename: {
		type: Sequelize.STRING,
	},
	original_title: {
		type: Sequelize.STRING,
	},
	english_title: {
		type: Sequelize.STRING,
	},
	slug: {
		type: Sequelize.STRING,
		unique: true,
	},
	structure: {
		type: Sequelize.STRING,
	},
	form: {
		type: Sequelize.STRING,
	},
	urn: {
		type: Sequelize.STRING,
	},
	work_type: {
		type: Sequelize.STRING,
		allowNull: true
	},
	label: {
		type: Sequelize.STRING,
		allowNull: true
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true
	},
	full_urn: {
		type: Sequelize.STRING,
		allowNull: true
	}
}, {
	timestamps: false,
});

Work.associate = ({ models }) => {
	Work.belongsTo(models.authors);
	Work.belongsTo(models.textgroups);
	Work.belongsTo(models.languages);
	Work.hasMany(models.versions);
	Work.hasMany(models.exemplars);
	Work.hasMany(models.translations);
	Work.hasMany(models.textnodes);
	Work.hasMany(models.refsdecls);
};

SequelizeSlugify.slugifyModel(Work, {
	source: ['english_title'],
	slugOptions: { lower: true },
	column: 'slug'
});


export default Work;
