import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Collection from '../../models/collection';


/**
 * Collection model type
 * @type {GraphQLObjectType}
 */
const collectionType = new GraphQLObjectType({
	name: 'Collection',
	description: 'A collection of texts (usually described as a git repository)',
	fields: _.assign(attributeFields(Collection)),
});

export default collectionType;
