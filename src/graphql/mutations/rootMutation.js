import { GraphQLObjectType } from 'graphql';

import textNodeMutationFields from './textNodes';
import workMutationFields from './works';
import translationMutationFields from './translations';
import refsDeclsMutationFields from './refsDecls';
import versionsMutationFields from './versions';


/**
 * Root mutations
 * @type {GraphQLObjectType}
 */
const RootMutations = new GraphQLObjectType({
	name: 'RootMutationType',
	description: 'Root mutation object type',
	fields: {
		...textNodeMutationFields,
		...workMutationFields,
		...translationMutationFields,
		...refsDeclsMutationFields,
		...versionsMutationFields,
	},
});

export default RootMutations;
