import {tester} from 'graphql-tester';
import {create as createExpressWrapper, dbTruncate} from '../../testUtils';
import {app} from '../../app';
import db from '../../db';

describe('GraphQL - Work ...', () => {

	const testServer = tester({
		server: createExpressWrapper(app),
		url: '/graphql',
		contentType: 'application/json'
	});

	afterAll(() => {
		db.close();
	});

	it('should be able to fetch correct metadata for edition type of work from CTS text source.', async () => {

		// SETUP
		const gql = {
			query: `query workMeta {
				works(
					full_urn:"urn:cts:greekLit:tlg0008.tlg001.perseus-grc3", 
				) 
				{
					id
					english_title
					urn
					full_urn
					work_type
					label
					description
				}
			}`,
			variables: {}
		};

		// RUN
		const response = await testServer(JSON.stringify(gql));

		// CHECK
		expect(response.errors).toBeFalsy();
		expect(response.success).toBe(true);
		expect(response.data.works.length).toBeGreaterThan(0);
		expect(response.data.works[0].full_urn).toEqual('urn:cts:greekLit:tlg0008.tlg001.perseus-grc3');
		expect(response.data.works[0].work_type).toEqual('edition');
		expect(response.data.works[0].label).toBeTruthy();
		expect(response.data.works[0].description).toBeTruthy();

	});

	it('should be able to fetch correct metadata for translation type of work from CTS text source.', async () => {

		// SETUP
		const gql = {
			query: `query workMeta {
				works(
					full_urn:"urn:cts:greekLit:tlg0012.tlg001.perseus-eng3", 
				) 
				{
					id
					english_title
					urn
					full_urn
					work_type
					label
					description
				}
			}`,
			variables: {}
		};

		// RUN
		const response = await testServer(JSON.stringify(gql));

		// CHECK
		expect(response.errors).toBeFalsy();
		expect(response.success).toBe(true);
		expect(response.data.works.length).toBeGreaterThan(0);
		expect(response.data.works[0].full_urn).toEqual('urn:cts:greekLit:tlg0012.tlg001.perseus-eng3');
		expect(response.data.works[0].work_type).toEqual('translation');
		expect(response.data.works[0].label).toBeTruthy();
		expect(response.data.works[0].description).toBeTruthy();

	});

});
