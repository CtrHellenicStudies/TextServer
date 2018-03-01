// test LightWrightCTS module and its interactions with LightWeightCTSServer
import {tester} from 'graphql-tester';

import {create as createExpressWrapper} from './appWrapper';
import app from '../src/app';

describe('LightWeightCTS module', () => {

	const LwctsTest = tester({
		server: createExpressWrapper(app),
		url: '/graphql',
		contentType: 'application/json'
	});

	describe('GetTextByURN', async () => {

		const gqlQuery = {
			query: `{
				lightWeightCts(
				  urn: "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-1.12"
				)
			  }`,
			variables: {}
		};

		it('should get the correct text for the given URN', async () => {
			let response;
			try {
				response = await LwctsTest(JSON.stringify(gqlQuery));
				expect(response.status).toBe(200);
				expect(response.success).toBe(true);
				expect(response.data.lightWeightCts.MapCitationPassage).toHaveProperty(['1.1']);
				expect(response.data.lightWeightCts.MapCitationPassage).toHaveProperty(['1.12']);
			} catch (err) {
				expect(err).toBe(null);
			}
		});

	});

});
