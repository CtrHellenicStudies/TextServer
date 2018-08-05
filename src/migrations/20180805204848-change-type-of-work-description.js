

module.exports = {
	up: (queryInterface, Sequelize) => queryInterface.changeColumn('works', 'description', {
		type: Sequelize.TEXT,
		allowNull: true
	}),

	down: (queryInterface, Sequelize) => queryInterface.changeColumn('works', 'description', {
		type: Sequelize.STRING,
		allowNull: true
	})
};
