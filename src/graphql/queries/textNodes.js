import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import TextNodeType from '../types/textNode'; // eslint-disable-line
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';
import TextNodeService from '../logic/textNodes';

const textNodeFields = {
	textNodes: {
		type: new GraphQLList(TextNodeType),
		args: {
			index: {
				type: GraphQLInt,
			},
			urn: {
				type: CtsUrnType,
			},
			location: {
				type: new GraphQLList(GraphQLInt),
			},
			startsAtLocation: {
				type: new GraphQLList(GraphQLInt),
			},
			endsAtLocation: {
				type: new GraphQLList(GraphQLInt),
			},
			startsAtIndex: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, {
			index, urn, location, startsAtLocation, endsAtLocation, startsAtIndex,
			offset,
		}, { token }) {
			const textNodeService = new TextNodeService({ token });
			return textNodeService.textNodesGet(
				index, urn, location, startsAtLocation, endsAtLocation, startsAtIndex,
				offset,
			);
		},
	},
};

export default textNodeFields;
