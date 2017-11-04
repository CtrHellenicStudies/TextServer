import Sequelize from 'sequelize';
import db from '../db';

/**
 * An exemplar metadata information of a specific work
 */
const Exemplar = db.define('exemplars', {
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
	description: {
		type: Sequelize.STRING,
	},
}, {
		timestamps: false,
		tableName: 'collections',
});

Exemplar.associate = ({ models }) => {
	Exemplar.belongsTo(models.works);
};


export default Exemplar;
