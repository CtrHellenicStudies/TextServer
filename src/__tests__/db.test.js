
import db from '../db';

describe('Database Tests ...', () => {

	afterAll(() => {
		db.close();
	});

	it('should be using the correct test database', () => {
		// SETUP
		
		// RUN

		// CHECK
		const expectedTestDBName = 'textserver_test';
		expect(db.connectionManager.config.database).toEqual(expectedTestDBName);
	});

	it('should have the correct tables in the database', async () => {
		// SETUP
		const expectedAllTables = [
			'SequelizeMeta',
			'exemplars',
			'refsdecls',
			'collections',
			'textnodes',
			'translations',
			'versions',
			'authors',
			'languages',
			'textgroups',
			'works',
		];

		// RUN
		const allTables = await db.getQueryInterface().showAllTables();

		// CHECK
		const differencesInTables = expectedAllTables 
			.filter(x => !allTables.includes(x))
			.concat(allTables.filter(x => !expectedAllTables.includes(x))); // find non-intersection of expected tables and actual tables
		expect(differencesInTables).toEqual([]);
	});

});
