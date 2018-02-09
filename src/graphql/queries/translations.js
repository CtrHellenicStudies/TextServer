import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import TranslationType from '../types/translation';
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';
import TranslationService from '../logic/translations';

const translationFields = {
	translations: {
		type: new GraphQLList(TranslationType),
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
		async resolve(_, { textsearch, urn, limit, offset }, { token }) {
			const translationService = new TranslationService(token);
			return await translationService.getTranslations(textsearch, urn, offset, limit);
		},
	},
	translation: {
		type: TranslationType,
		args: {
			id: {
				type: GraphQLInt,
			},
			slug: {
				type: GraphQLString,
			},
		},
		async resolve(_, { id, slug }, { token }) {
			const translationService = new TranslationService(token);
			return await translationService.getTranslation(id, slug);
		},
	},
};

export default translationFields;
