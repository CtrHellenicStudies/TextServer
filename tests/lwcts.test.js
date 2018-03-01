// test LightWrightCTS module and its interactions with LightWeightCTSServer
// TODO use test server instance instead of having to have the server up for testing
const tester = require('graphql-tester').tester;

describe('LightWeightCTS module', () => {

	const lwctsTest = tester({
		url: `http://localhost:${(process.env.PORT || 3003)}/graphql`, // TODO get port from app
		contentType: 'application/json'
	});

	describe('GetText', async () => {

		const gqlQuery = {
			query: `{
				lightWeightCts(
				  urn: "urn:cts:greekLit:tlg0012.tlg001.perseus-grc2:1.1-1.12"
				)
			  }`,
			variables: {}
		};

		it('should get the correct text', async () => {
			let response;
			try {
				response = await lwctsTest(JSON.stringify(gqlQuery));
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
