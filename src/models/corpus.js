import Sequelize from 'sequelize';
import db from '../db';

const Corpus = db.define('corpora', {
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
}, {
		timestamps: false,
		tableName: 'corpora',
});

Corpus.associate = ({ models }) => {
	Corpus.hasMany(models.authors);
	Corpus.hasMany(models.works);
};


export default Corpus;
