import Sequelize from 'sequelize';
import db from '../postgres';

const LanguageModel = db.define('languages', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		mid: {
			type: Sequelize.STRING,
		},
		title: {
			type: Sequelize.STRING,
		},
		slug: {
			type: Sequelize.STRING,
		},
}, {
		timestamps: false,
		
});

const Language = db.models.languages;


export default Language;
