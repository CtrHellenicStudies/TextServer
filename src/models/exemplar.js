import Sequelize from 'sequelize';
import SequelizeSlugify from 'sequelize-slugify';
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
	urn: {
		type: Sequelize.STRING,
	},
}, {
	timestamps: false,
});

Exemplar.associate = ({ models }) => {
	Exemplar.belongsTo(models.works);
};

SequelizeSlugify.slugifyModel(Exemplar, {
    source: ['title'],
    slugOptions: { lower: true },
    overwrite: false,
    column: 'slug'
});


export default Exemplar;
