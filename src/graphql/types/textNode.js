import _ from 'underscore';
import { GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import TextNode from '../../models/textNode';


/**
 * Text Nodes model type
 * @type {GraphQLObjectType}
 */
const TextNodeType = new GraphQLObjectType({
	name: 'TextNode',
	description: 'A textNode in a work, similar to data model from Draft.js',
	fields: _.assign(attributeFields(TextNode)),
});

/**
 * Text Nodes input model type
 * @type {GraphQLInputObjectType}
 */
const TextNodeInputType = new GraphQLInputObjectType({
	name: 'TextNodeInput',
	description: 'Input type for a textNode in a work, similar to data model from Draft.js',
	fields: _.assign(attributeFields(TextNode)),
});

export { TextNodeType, TextNodeInputType };
