// test LightWrightCTS module and its interactions with LightWeightCTSServer
import { tester } from 'graphql-tester';

import { create as createExpressWrapper } from '../../testUtils';
import { app } from '../../app';

describe('Module - LightWeightCTS', () => {

	const testServer = tester({
		server: createExpressWrapper(app),
		url: '/graphql',
		contentType: 'application/json'
	});

	it('should get the correct text for the given URN', async () => {
		// SETUP
		const gqlQuery = {
			query: `{
					lightWeightCts(
						urn: "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-1.12"
					)
				}`,
			variables: {}
		};

		// RUN
		const response = await testServer(JSON.stringify(gqlQuery));

		// CHECK
		expect(response.status).toBe(200);
		expect(response.success).toBe(true);
		expect(response.data.lightWeightCts.MapCitationPassage).toHaveProperty(['1.1']);
		expect(response.data.lightWeightCts.MapCitationPassage).toHaveProperty(['1.12']);
	});

});
