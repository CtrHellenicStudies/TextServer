import Sequelize from 'sequelize';
import db from '../db';

const Language = db.define('languages', {
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
}, {
		timestamps: false,

});

Language.associate = ({ models }) => {
	Language.belongsTo(models.works);
};

export default Language;
