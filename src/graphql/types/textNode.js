import {_} from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields} from 'graphql-sequelize';

import TextNode from '../../models/textNode';

const textNodeType = new GraphQLObjectType({
	name: 'TextNode',
	description: 'A textNode',
	fields: _.assign(attributeFields(TextNode)),
});

export default textNodeType;
