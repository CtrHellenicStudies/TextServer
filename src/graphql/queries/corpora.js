import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

import CorpusType from '../types/corpus';
import CorpusService from '../logic/collections';

const corpusFields = {
	collections: {
		type: new GraphQLList(CorpusType),
		args: {
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { limit, offset, }, { token }) {
			const corpusService = new CorpusService(token);
			return await corpusService.getCorpora(limit, offset);
		},
	},
	corpus: {
		type: CorpusType,
		args: {
			id: {
				type: GraphQLInt,
			},
			slug: {
				type: GraphQLString,
			},
		},
		async resolve(_, { id, slug }, { token }) {
			const corpusService = new CorpusService(token);
			return await corpusService.getCorpus(id, slug);
		},
	},
};

export default corpusFields;
