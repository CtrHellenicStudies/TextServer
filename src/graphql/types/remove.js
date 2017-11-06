import { GraphQLObjectType, GraphQLID } from 'graphql';


/**
 * Remove type
 * @type {GraphQLObjectType}
 */
const RemoveType = new GraphQLObjectType({
	name: 'RemoveType',
	fields: {
		id: {
			type: GraphQLID,
		},
	},
});

export default RemoveType;
