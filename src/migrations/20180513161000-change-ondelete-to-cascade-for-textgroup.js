module.exports = {
	up: async (queryInterface, Sequelize) => {
		return [
			await queryInterface.removeConstraint('textgroups', 'textgroups_collectionId_fkey'),
			await queryInterface.addConstraint('textgroups', ['collectionId'], {
				type: 'foreign key',
				name: 'FK_textgroups_collections',
				references: {
					table: 'collections',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			})
		];
	},

	down: async (queryInterface, Sequelize) => {
		return [
			await queryInterface.removeConstraint('textgroups', 'FK_textgroups_collections'),
			await queryInterface.addConstraint('textgroups', ['collectionId'], {
				type: 'foreign key',
				name: 'textgroups_collectionId_fkey',
				references: {
					table: 'collections',
					field: 'id'
				},
				onDelete: 'set null',
				onUpdate: 'cascade'
			})
		];
	}
};
