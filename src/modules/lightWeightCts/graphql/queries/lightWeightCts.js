import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import LightWeightCtsService from '../logic/lightWeightCts';
import LightWeightCtsResponseType from '../types/lightWeightCtsResponse'; // eslint-disable-line
import CtsUrnType from '../../../cts/graphql/types/CtsUrn';

const textNodeFields = {
	lightWeightCts: {
		type: LightWeightCtsResponseType,
		args: {
			urn: {
				type: CtsUrnType,
			},
		},
		async resolve(_, { urn, }, { token }) {
			const lightWeightCtsService = new LightWeightCtsService({ token });
			const response = await lightWeightCtsService.getApiResponse({ urn });
			return response;
		},
	},
};

export default textNodeFields;
