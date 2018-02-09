/**
 * Mutations for translations
 */

import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

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
			_id: {
				type: GraphQLString
			},
			translation: {
				type: TranslationInputType
			}
		},
		async resolve(parent, { _id, translation }, { token }) {
			const translationsService = new TranslationsService({ token });
			return await translationsService.translationUpdate(_id, translation);
		}
	},
	translationRemove: {
		type: RemoveType,
		description: 'Remove a single translation',
		args: {
			translationId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, { translationId }, { token }) {
			const translationsService = new TranslationsService({ token });
			return await translationsService.translationRemove(translationId);
		}
	}
};

export default translationsMutationFields;
