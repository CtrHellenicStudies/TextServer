import _ from 'underscore';
import {
	GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull, GraphQLList,
	GraphQLSchema, GraphQLInt, GraphQLString, GraphQLID
} from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import TextNodeService from '../logic/textNodes';
import CtsUrn from '../../modules/cts/graphql/types/CtsUrn';

/**
 * Word model type
 * @type {GraphQLObjectType}
 */
const WordType = new GraphQLObjectType({
	name: 'Word',
	description: 'A word in a textnode',
	fields: {
		word: {
			type: GraphQLString,
		},
		urn: {
			type: GraphQLString,
			resolve(parent, {}, { token }) {
				const textNodeService = new TextNodeService({ token });
				return textNodeService.getWordURN(parent);
			},
		},
	},
});


export default WordType;
