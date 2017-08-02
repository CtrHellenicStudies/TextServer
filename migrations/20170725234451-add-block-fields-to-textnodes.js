'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		/*
		Add altering commands here.
		Return a promise to correctly handle asynchronicity.

		Example:
		return queryInterface.createTable('users', { id: Sequelize.INTEGER });
		*/

		// It seems like wrapping these `addColumn()` calls
		// in a `Promise.all()` introduces locks on the table,
		// so it's more performant to run them individually.
		return queryInterface.addColumn(
			'textnodes',
			'data',
			{
				allowNull: false,
				defaultValue: [],
				type: Sequelize.JSON,
			}
		).then(() => queryInterface.addColumn(
			'textnodes',
			'entityRanges',
			{
				allowNull: false,
				defaultValue: [],
				type: Sequelize.ARRAY(Sequelize.JSON),
			}
		).then(() => queryInterface.addColumn(
			'textnodes',
			'inlineStyleRanges',
			{
				allowNull: false,
				defaultValue: [],
				type: Sequelize.ARRAY(Sequelize.JSON),
			}
		).then(() => queryInterface.addColumn(
			'textnodes',
			'type',
			{
				allowNull: false,
				defaultValue: 'unstyled',
				type: Sequelize.STRING,
			}
		))));
	},

	down: function (queryInterface, Sequelize) {
		/*
		Add reverting commands here.
		Return a promise to correctly handle asynchronicity.

		Example:
		return queryInterface.dropTable('users');
		*/

		return queryInterface.removeColumn(
			'textnodes',
			'data'
		).then(() => queryInterface.removeColumn(
			'textnodes',
			'entityRanges'
		).then(() => queryInterface.removeColumn(
			'textnodes',
			'inlineStyleRanges'
		).then(() => queryInterface.removeColumn(
			'textnodes',
			'type'
		))));
	}
};
