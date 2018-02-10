/**
 * Mutations for translations
 */

import { GraphQLString, GraphQLNonNull, GraphQLID, GraphQLInt } from 'graphql';

// types
import { TranslationType, TranslationInputType } from '../types/translation';
import RemoveType from '../types/remove';

// logic
import TranslationsService from '../logic/translations';

const translationsMutationFields = {
	translationCreate: {
		type: TranslationType,
		description: 'Create a new translation',
		args: {
			translation: {
				type: TranslationInputType
			}
		},
		async resolve(parent, { translation }, { token }) {
			const translationsService = new TranslationsService({ token });
			return await translationsService.translationInsert(translation);
		}
	},
	translationUpdate: {
		type: TranslationType,
		description: 'Update a translation',
		args: {
			id: {
				type: GraphQLInt,
			},
			translation: {
				type: TranslationInputType
			}
		},
		async resolve(parent, { id, translation }, { token }) {
			const translationsService = new TranslationsService({ token });
			return await translationsService.translationUpdate(id, translation);
		}
	},
	translationRemove: {
		type: RemoveType,
		description: 'Remove a single translation',
		args: {
			id: {
				type: GraphQLInt,
			}
		},
		async resolve(parent, { id }, { token }) {
			const translationsService = new TranslationsService({ token });
			return await translationsService.translationRemove(id);
		}
	}
};

export default translationsMutationFields;
