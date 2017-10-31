import Sequelize from 'sequelize';
import db from '../db';

const Work = db.define('works', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		edition: {
			type: Sequelize.STRING,
		},
		slug: {
			type: Sequelize.STRING,
		},
		hash: {
			type: Sequelize.STRING,
		},
		author: {
			type: Sequelize.STRING,
		},
		structure: {
			type: Sequelize.STRING,
		},
		originaltitle: {
			type: Sequelize.STRING,
		},
		filename: {
			type: Sequelize.STRING,
		},
		englishtitle: {
			type: Sequelize.STRING,
		},
		language: {
			type: Sequelize.STRING,
		},
		form: {
			type: Sequelize.STRING,
		},
		corpus: {
			type: Sequelize.STRING,
		},
}, {
		timestamps: false,

});

Work.associate = ({ models }) => {
	Work.belongsTo(models.authors);
	Work.belongsTo(models.corpora);
};


export default Work;
