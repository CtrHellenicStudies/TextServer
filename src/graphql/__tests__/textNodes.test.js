import {tester} from 'graphql-tester';
import {create as createExpressWrapper, dbTruncate} from '../../testUtils';
import {app} from '../../app';
import db from '../../db';

describe('GraphQL - TextNode ...', () => {

	const testServer = tester({
		server: createExpressWrapper(app),
		url: '/graphql',
		contentType: 'application/json'
	});

	afterAll(() => {
		db.close();
	});

	it('should be able to query the correct index of textNodes when using citation range.', async () => {

		const textNodesContainCorrectIndex = (textNodes, correctIndex) => {
			for (let i = 0; i < textNodes.length; i += 1) {
				if (textNodes[i].index === correctIndex) {
					return true;
				}
			}
			return false;
		};

		// SETUP
		const gqlTextNodeByCitationRange = {
			query: `query citationRange {
				textNodes(
				  urn:"urn:cts:greekLit:tlg0012.tlg001:1.1-1.2", 
				  ) 
				{
				  id
				  location
				  text
				  index
				}
			}`,
			variables: {}
		};

		// RUN
		const response = await testServer(JSON.stringify(gqlTextNodeByCitationRange));

		// CHECK
		expect(response.status).toBe(200);
		expect(response.success).toBe(true);
		expect(textNodesContainCorrectIndex(response.data.textNodes, 0)).toBe(true); // starting index 0 for citation 1.1
		expect(textNodesContainCorrectIndex(response.data.textNodes, 1)).toBe(true); // ending index 1 for citation 1.2

	});

});
