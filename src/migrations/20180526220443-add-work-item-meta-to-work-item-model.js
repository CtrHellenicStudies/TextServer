module.exports = {
	up: async (queryInterface, Sequelize) => {
		return [
			await queryInterface.addColumn(
        'works',
        'work_type',
				{
					type: Sequelize.STRING,
					allowNull: true
				}
      ),
			await queryInterface.addColumn(
        'works',
        'label',
				{
					type: Sequelize.STRING,
					allowNull: true
				}
      ),
			await queryInterface.addColumn(
        'works',
        'description',
				{
					type: Sequelize.STRING,
					allowNull: true
				}
      ),
			await queryInterface.addColumn(
        'works',
        'full_urn',
				{
					type: Sequelize.STRING,
					allowNull: true
				}
      ),
		];
	},

	down: async (queryInterface, Sequelize) => {
		return [
			await queryInterface.removeColumn('works', 'work_type'),
			await queryInterface.removeColumn('works', 'label'),
			await queryInterface.removeColumn('works', 'description'),
			await queryInterface.removeColumn('works', 'full_urn'),
		];
	}
};
