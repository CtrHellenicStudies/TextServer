import Sequelize from 'sequelize';
import db from '../db';

/**
 * A textgroup in a collection
 */
const TextGroup = db.define('textgroups', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
	},
	title: {
		type: Sequelize.STRING,
	},
	slug: {
		type: Sequelize.STRING,
		unique: true,
	},
}, {
	timestamps: false,
});

TextGroup.associate = ({ models }) => {
	TextGroup.belongsTo(models.collections);
	TextGroup.hasMany(models.works);
};


export default TextGroup;
