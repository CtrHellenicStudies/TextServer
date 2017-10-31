import { GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';

import TextNodeType from '../types/textNode';
import TextNodeService from '../logic/textNodes';

const textNodeFields = {
	textLocationNext: {
		type: new GraphQLList(GraphQLInt),
		args: {
			work: {
				type: GraphQLInt,
			 },
			location: {
				type: new GraphQLList(GraphQLInt),
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { work, location, offset }, { token }) {
			const textNodeService = new TextNodeService(token);
			return await textNodeService.textLocationNext(work, location, offset);
		},
	},
	textLocationPrev: {
		type: new GraphQLList(GraphQLInt),
		args: {
			work: {
				type: GraphQLInt,
			},
			location: {
				type: new GraphQLList(GraphQLInt),
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { work, location, offset }, { token }) {
			const textNodeService = new TextNodeService(token);
			return await textNodeService.textLocationPrev(work, location, offset);
		},
	},
};

export default textNodeFields;
