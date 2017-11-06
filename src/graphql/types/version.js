import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Version from '../../models/version';

/**
 * Version model type
 * @type {GraphQLObjectType}
 */
const VersionType = new GraphQLObjectType({
	name: 'Version',
	description: 'An version of a work (if available)',
	fields: _.assign(attributeFields(Version)),
});

export default VersionType;
