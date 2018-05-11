module.exports = {
	up: async (queryInterface, Sequelize) => {
		return [
			await queryInterface.removeConstraint('versions', 'versions_workId_fkey'),
			await queryInterface.addConstraint('versions', ['workId'], {
				type: 'foreign key',
				name: 'FK_versions_works',
				references: {
					table: 'works',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			}),
			await queryInterface.removeConstraint('translations', 'translations_workId_fkey'),
			await queryInterface.addConstraint('translations', ['workId'], {
				type: 'foreign key',
				name: 'FK_translations_works',
				references: {
					table: 'works',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			}),
			await queryInterface.removeConstraint('textnodes', 'textnodes_workId_fkey'),
			await queryInterface.addConstraint('textnodes', ['workId'], {
				type: 'foreign key',
				name: 'FK_textnodes_works',
				references: {
					table: 'works',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			}),
			await queryInterface.removeConstraint('refsdecls', 'refsdecls_workId_fkey'),
			await queryInterface.addConstraint('refsdecls', ['workId'], {
				type: 'foreign key',
				name: 'FK_refsdecls_works',
				references: {
					table: 'works',
					field: 'id'
				},
				onDelete: 'cascade',
				onUpdate: 'cascade'
			})
		];
	},

	down: async (queryInterface, Sequelize) => {
		return [
			await queryInterface.removeConstraint('versions', 'FK_versions_works'),
			await queryInterface.addConstraint('versions', ['workId'], {
				type: 'foreign key',
				name: 'versions_workId_fkey',
				references: {
					table: 'works',
					field: 'id'
				},
				onDelete: 'set null',
				onUpdate: 'cascade'
			}),
			await queryInterface.removeConstraint('translations', 'FK_translations_works'),
			await queryInterface.addConstraint('translations', ['workId'], {
				type: 'foreign key',
				name: 'translations_workId_fkey',
				references: {
					table: 'works',
					field: 'id'
				},
				onDelete: 'set null',
				onUpdate: 'cascade'
			}),
			await queryInterface.removeConstraint('textnodes', 'FK_textnodes_works'),
			await queryInterface.addConstraint('textnodes', ['workId'], {
				type: 'foreign key',
				name: 'textnodes_workId_fkey',
				references: {
					table: 'works',
					field: 'id'
				},
				onDelete: 'set null',
				onUpdate: 'cascade'
			}),
			await queryInterface.removeConstraint('refsdecls', 'FK_refsdecls_works'),
			await queryInterface.addConstraint('refsdecls', ['workId'], {
				type: 'foreign key',
				name: 'refsdecls_workId_fkey',
				references: {
					table: 'works',
					field: 'id'
				},
				onDelete: 'set null',
				onUpdate: 'cascade'
			})
		];
	}
};
