import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import TextGroup from '../../models/textGroup';

/**
 * TextGroup model type
 * @type {GraphQLObjectType}
 */
const TextGroupType = new GraphQLObjectType({
	name: 'TextGroup',
	description: 'A textGroup in a collection',
	fields: _.assign(attributeFields(TextGroup)),
});

export default TextGroupType;
