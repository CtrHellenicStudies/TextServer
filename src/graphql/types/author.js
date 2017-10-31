import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Author from '../../models/author';

/**
 * Author model type
 * @type {GraphQLObjectType}
 */
const authorType = new GraphQLObjectType({
	name: 'Author',
	description: 'An author of a work (if available)',
	fields: _.assign(attributeFields(Author)),
});

export default authorType;
