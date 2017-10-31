import { GraphQLObjectType } from 'graphql';

import textNodeMutationFields from './textNodes';
import workMutationFields from './works';

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
	},
});

export default RootMutations;
