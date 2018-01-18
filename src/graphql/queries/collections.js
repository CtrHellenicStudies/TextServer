import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

import CollectionType from '../types/collection';
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';
import CollectionService from '../logic/collections';

const collectionFields = {
	collections: {
		type: new GraphQLList(CollectionType),
		args: {
			textsearch: {
				type: GraphQLString,
			},
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
		async resolve(_, { textsearch, urn, limit, offset, }, { token }) {
			const collectionService = new CollectionService(token);
			const collections = await collectionService.getCollections(textsearch, urn, offset, limit);
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
		},
		async resolve(_, { id, slug }, { token }) {
			const collectionService = new CollectionService(token);
			const collection = await collectionService.getCollection(id, slug);
			return collection;
		},
	},
};

export default collectionFields;
