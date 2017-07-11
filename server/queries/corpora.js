import { GraphQLString, GraphQLList } from 'graphql';

import corpusType from '../types/models/corpus';
import Corpus from '../models/corpus';

const corpusFields = {
	corpora: {
		type: new GraphQLList(corpusType),
		args: { },
		resolve(_, {}) {
			const corpora = Corpus.findAll();
			return corpora.then(
				doc => doc,
				err => console.error(err));
		},
	},
	corpusBySlug: {
		type: corpusType,
		args: { slug: { type: GraphQLString } },
		resolve(_, {slug}) {
			const corpus = Corpus.findOne({ where: { slug } });
			return corpus.then(
				doc => doc,
				err => console.error(err));
		},
	},
};

export default corpusFields;
