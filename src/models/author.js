import Sequelize from 'sequelize';
import db from '../db';

const Author = db.define('authors', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
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


Author.associate = ({ models }) => {
	Author.hasMany(models.works);
	Author.belongsTo(models.corpora);
};


export default Author;
