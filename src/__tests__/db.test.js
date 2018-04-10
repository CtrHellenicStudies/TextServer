
import db from '../db';

describe('Database Tests ...', () => {

	it('should be using the correct test database', () => {
		// SETUP
		
		// RUN

		// CHECK
		const expectedTestDBName = 'textserver_test';
		expect(db.connectionManager.config.database).toEqual(expectedTestDBName);
	});

});
