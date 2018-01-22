import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import PerseusCtsService from '../logic/perseusCts';
import PerseusCtsResponseType from '../types/perseusCtsResponse'; // eslint-disable-line
import CtsUrnType from '../../../cts/graphql/types/CtsUrn';

const textNodeFields = {
	perseusCts: {
		type: PerseusCtsResponseType,
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
			const perseusCtsService = new PerseusCtsService({ token });
			const response = await perseusCtsService.getApiResponse({ request, urn });
			return response;
		},
	},
};

export default textNodeFields;
