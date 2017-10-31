import { GraphQLObjectType } from 'graphql';

/**
 * Root mutations
 * @type {GraphQLObjectType}
 */
const RootMutations = new GraphQLObjectType({
	name: 'RootMutationType',
	description: 'Root mutation object type',
	fields: {
		// ...userMutationFields,
	},
});

export default RootMutations;
