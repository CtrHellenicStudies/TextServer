import Sequelize from 'sequelize';
import db from '../db';

const TextNode = db.define('textNodes', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	index: {
		type: Sequelize.INTEGER,
	},
	location: {
		type: Sequelize.ARRAY(Sequelize.INTEGER),
	},
	text: {
		type: Sequelize.STRING,
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
	tableName: 'textnodes',
});

TextNode.associate = ({ models }) => {
	TextNode.hasMany(models.words);
	TextNode.belongsTo(models.works);
};

export default TextNode;
