import Sequelize from 'sequelize';
import db from '../db';

/**
 * A work in a textgroup, represented as a file in a git repository
 */
const Work = db.define('works', {
	id: {
		type: Sequelize.INTEGER,
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
		type: Sequelize.ARRAY(Sequelize.STRING),
	},
	form: {
		type: Sequelize.STRING,
	},
	ctsUrn: {
		type: Sequelize.STRING,
	},
}, {
	timestamps: false,
});

Work.associate = ({ models }) => {
	Work.belongsTo(models.authors);
	Work.belongsTo(models.textgroups);
	Work.hasMany(models.languages);
	Work.hasMany(models.versions);
	Work.hasMany(models.exemplars);
};


export default Work;
