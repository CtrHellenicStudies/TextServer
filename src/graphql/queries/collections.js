import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

import CollectionType from '../types/collection';
import CollectionService from '../logic/collections';

const collectionFields = {
	collections: {
		type: new GraphQLList(CollectionType),
		args: {
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { limit, offset, }, { token }) {
			const collectionService = new CollectionService(token);
			return await collectionService.getCollection(limit, offset);
		},
	},
	collection: {
		type: CollectionType,
		args: {
			id: {
				type: GraphQLInt,
			},
			slug: {
				type: GraphQLString,
			},
		},
		async resolve(_, { id, slug }, { token }) {
			const collectionService = new CollectionService(token);
			return await collectionService.getCollection(id, slug);
		},
	},
};

export default collectionFields;
