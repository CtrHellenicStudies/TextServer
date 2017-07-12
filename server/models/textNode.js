import Sequelize from 'sequelize';
import db from '../postgres';

const TextNodeModel = db.define('textNodes', {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		index: {
			type: Sequelize.INTEGER,
		},
		location: {
			type: Sequelize.STRING,
		},
		text: {
			type: Sequelize.STRING,
		},
		workid: {
			type: Sequelize.INT,
		},
		corpus: {
			type: Sequelize.STRING,
		},
		language: {
			type: Sequelize.STRING,
		},
		author: {
			type: Sequelize.STRING,
		},
}, {
		timestamps: false,
		tableName: "textnodes",
});

const TextNode = db.models.textNodes;


export default TextNode;
