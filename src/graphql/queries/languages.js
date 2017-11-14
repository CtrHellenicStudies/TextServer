import { GraphQLString, GraphQLList, GraphQLInt } from 'graphql';

import LanguageType from '../types/language';
import LanguageService from '../logic/languages';

const languageFields = {
	languages: {
		type: new GraphQLList(LanguageType),
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
		async resolve(_, { textsearch, limit, offset }, { token }) {
			const languageService = new LanguageService(token);
			return await languageService.getLanguages(textsearch, offset, limit);
		},
	},
	language: {
		type: LanguageType,
		args: {
			id: {
				type: GraphQLInt,
			},
			slug: {
				type: GraphQLString,
			},
		},
		async resolve(_, { id, slug }, { token }) {
			const languageService = new LanguageService(token);
			return await languageService.getLanguage(id, slug);
		},
	},
};

export default languageFields;
