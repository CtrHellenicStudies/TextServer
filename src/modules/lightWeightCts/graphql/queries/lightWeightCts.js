import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import LightWeightCtsService from '../logic/lightWeightCts';
import LightWeightCtsResponseType from '../types/lightWeightCtsResponse'; // eslint-disable-line
import CtsUrnType from '../../../cts/graphql/types/CtsUrn';

const textNodeFields = {
	lightWeightCts: {
		type: LightWeightCtsResponseType,
		args: {
			request: {
				type: GraphQLString,
			},
			urn: {
				type: CtsUrnType,
			},
			level: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { request = 'GetCapabilities', urn, level }, { token }) {
			const lightWeightCtsService = new LightWeightCtsService({ token });
			const response = await lightWeightCtsService.getApiResponse({ request, urn });
			return response;
		},
	},
};

export default textNodeFields;
