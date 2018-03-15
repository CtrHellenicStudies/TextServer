import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
import db from '../db';

/**
 * A referance delcaration of a work item
 */
const RefsDecl = db.define('refsdecls', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	label: {
		type: Sequelize.STRING,
	},
	slug: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: {
		type: Sequelize.TEXT,
	},
	match_pattern: {
		type: Sequelize.STRING,
	},
	replacement_pattern: {
		type: Sequelize.TEXT,
	},
	structure_index: {
		type: Sequelize.INTEGER,
	},
	urn: {
		type: Sequelize.STRING,
	},
}, {
	timestamps: false,
});

RefsDecl.associate = ({ models }) => {
	RefsDecl.belongsTo(models.works);
};

SequelizeSlugify.slugifyModel(RefsDecl, {
	source: ['label'],
	slugOptions: { lower: true },
	column: 'slug'
});

export default RefsDecl;
