import { GraphQLString, GraphQLList } from 'graphql';

import languageType from '../types/models/language';
import Language from '../models/language';

const languageFields = {
	languages: {
		type: new GraphQLList(languageType),
		args: {},
		resolve(_, {}) {
			const languages = Language.findAll();

			return languages.then(
				doc => doc,
				err => console.error(err));
		},
	},
	languageBySlug: {
		type: languageType,
		args: { slug: { type: GraphQLString } },
		resolve(_, {slug}) {
			const language = Language.findOne({ where: { slug } });
			return language.then(
				doc => doc,
				err => console.error(err));
		},
	},
};

export default languageFields;
