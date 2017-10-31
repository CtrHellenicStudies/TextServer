import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import TextNode from '../../models/textNode';


/**
 * Text Nodes model type
 * @type {GraphQLObjectType}
 */
const textNodeType = new GraphQLObjectType({
	name: 'TextNode',
	description: 'A textNode in a work, similar to data model from Draft.js',
	fields: _.assign(attributeFields(TextNode)),
});

export default textNodeType;
