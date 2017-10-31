import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import AuthorService from '../logic/authors';
import CorpusService from '../logic/corpora';
import LanguageService from '../logic/languages';
import WorkService from '../logic/works';

const countFields = {
	authorsCount: {
		type: GraphQLInt,
		async resolve(_, {}, { token }) {
			const authorService = AuthorService(token);
			return await authorService.count();
		},
	},
	corporaCount: {
		type: GraphQLInt,
		async resolve(_, {}, { token }) {
			const corpusService = CorpusService(token);
			return await corpusService.count();
		},
	},
	languagesCount: {
		type: GraphQLInt,
		async resolve(_, {}, { token }) {
			const languageService = LanguageService(token);
			return await languageService.count();
		},
	},
	worksCount: {
		type: GraphQLInt,
		async resolve(_, {}, { token }) {
			const workService = WorkService(token);
			return await workService.count();
		},
	},
};

export default countFields;
