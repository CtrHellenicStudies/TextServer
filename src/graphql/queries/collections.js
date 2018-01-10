import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

import CollectionType from '../types/collection';
import CollectionService from '../logic/collections';

const collectionFields = {
	collections: {
		type: new GraphQLList(CollectionType),
		args: {
			textsearch: {
				type: GraphQLString,
			},
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { textsearch, limit, offset, }, { token }) {
			const collectionService = new CollectionService(token);
			const collections = await collectionService.getCollections(textsearch, offset, limit);
			return collections;
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
			urn: {
				type: GraphQLString,
			},
		},
		async resolve(_, { id, slug, urn }, { token }) {
			const collectionService = new CollectionService(token);
			const collection = await collectionService.getCollection(id, slug, urn);
			return collection;
		},
	},
};

export default collectionFields;
