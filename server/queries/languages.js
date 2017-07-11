import { GraphQLString } from 'graphql';

import languageType from '../types/models/language';
import Language from '../models/language';

const languageFields = {
	languageBySlug: {
		type: languageType,
		args: { slug: { type: GraphQLString } },
		resolve(_, {slug}) {
			const language = Language.findOne({ where: { slug } });
			return language.then((doc) => {
				console.log(doc);
				return doc;
			});
		},
	},
};

export default languageFields;
