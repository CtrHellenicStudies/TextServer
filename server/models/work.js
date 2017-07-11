import Sequelize from 'sequelize';
import db from '../postgres';

const WorkModel = db.define('works', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		mid: {
			type: Sequelize.STRING,
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
		authors: {
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

const Work = db.models.works;


export default Work;
