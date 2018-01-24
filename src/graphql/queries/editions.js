import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

import EditionType from '../types/edition';

const editionFields = {
	editions: {
		type: new GraphQLList(EditionType),
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
			// const editionService = new EditionService(token);
			// return await editionService.getEditions(textsearch, offset, limit);
			return [{}];
		},
	},
	edition: {
		type: EditionType,
		args: {
			id: {
				type: GraphQLInt,
			},
			slug: {
				type: GraphQLString,
			},
		},
		async resolve(_, { id, slug }, { token }) {
			// const editionService = new EditionService(token);
			// return await editionService.getEdition(id, slug);
			return {};
		},
	},
};

export default editionFields;
