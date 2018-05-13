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
			}),
			await queryInterface.removeConstraint('works', 'works_textgroupId_fkey'),
			await queryInterface.addConstraint('works', ['textgroupId'], {
				type: 'foreign key',
				name: 'FK_works_textgroups',
				references: {
					table: 'textgroups',
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
			}),
			await queryInterface.removeConstraint('works', 'FK_works_textgroups'),
			await queryInterface.addConstraint('works', ['textgroupId'], {
				type: 'foreign key',
				name: 'works_textgroupId_fkey',
				references: {
					table: 'textgroups',
					field: 'id'
				},
				onDelete: 'set null',
				onUpdate: 'cascade'
			})
		];
	}
};
