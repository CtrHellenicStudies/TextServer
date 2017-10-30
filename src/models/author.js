import Sequelize from 'sequelize';
import db from '../postgres';

const AuthorModel = db.define('authors', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		language: {
			type: Sequelize.STRING,
		},
		englishname: {
			type: Sequelize.STRING,
		},
		originalname: {
			type: Sequelize.STRING,
		},
		slug: {
			type: Sequelize.STRING,
		},
}, {
		timestamps: false,

});

const Author = db.models.authors;


export default Author;
