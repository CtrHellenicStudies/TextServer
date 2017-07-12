import Sequelize from 'sequelize';
import db from '../postgres';

const CorpusModel = db.define('corpora', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		title: {
			type: Sequelize.STRING,
		},
		slug: {
			type: Sequelize.STRING,
		},
		link: {
			type: Sequelize.STRING,
		},
		language: {
			type: Sequelize.STRING,
		},
}, {
		timestamps: false,
		tableName: 'corpora',
});

const Corpus = db.models.corpora;


export default Corpus;
