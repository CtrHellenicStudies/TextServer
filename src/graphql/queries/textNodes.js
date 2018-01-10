import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import TextNodeType from '../types/textNode'; // eslint-disable-line
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';
import TextNodeService from '../logic/textNodes';

const textNodeFields = {
	textNodes: {
		type: new GraphQLList(TextNodeType),
		args: {
			urn: {
				type: CtsUrnType,
			},
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(__, { urn, limit, offset }, { token }) {
			const textNodeService = new TextNodeService(token);
			return await textNodeService.textNodesGetByUrn(urn, offset, limit);
		},
	},
};

export default textNodeFields;
