import _ from 'underscore';
import {
	GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull, GraphQLList,
	GraphQLSchema, GraphQLInt, GraphQLString, GraphQLID
} from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Work from '../../models/work';
import TextNodeService from '../logic/textNodes';
import LanguageService from '../logic/languages';
import { TextNodeType } from './textNode';
import LanguageType from './language';

/**
 * Works model type
 * @type {GraphQLObjectType}
 */
const WorkType = new GraphQLObjectType({
	name: 'Work',
	description: 'A work in a collection, associated with authors or possibly textgroups',
	fields: {
		id: {
			type: GraphQLID,
		},
		filemd5hash: {
			type: GraphQLString,
		},
		filename: {
			type: GraphQLString,
		},
		original_title: {
			type: GraphQLString,
		},
		english_title: {
			type: GraphQLString,
		},
		slug: {
			type: GraphQLString,
		},
		structure: {
			type: GraphQLString,
		},
		form: {
			type: GraphQLString,
		},
		urn: {
			type: GraphQLString,
		},
		language: {
			type: LanguageType,
			resolve(parent, {}, { token }) {
				const languageService = new LanguageService({ token });
				return languageService.getLanguage(parent.languageId);
			},
		},
		textNodes: {
			type: new GraphQLList(TextNodeType),
			args: {
				index: { type: GraphQLInt },
				slug : { type: GraphQLString },
				location: { type: new GraphQLList(GraphQLInt) },
				startsAtLocation: { type: new GraphQLList(GraphQLInt) },
				startsAtIndex: { type: GraphQLInt },
				offset: { type: GraphQLInt },
			},
			resolve(parent, { location, offset, index, startsAtLocation, startsAtIndex }, { token }) {
				const textNodeService = new TextNodeService({ token });
				return textNodeService.textNodesGet(parent.id, location, offset, index, startsAtLocation, startsAtIndex);
			},
		},
	},
});

/**
 * Work input model type
 * @type {GraphQLInputObjectType}
 */
const WorkInputType = new GraphQLInputObjectType({
	name: 'WorkInput',
	description: 'Input type for a work',
	fields: _.assign(attributeFields(Work)),
});

export { WorkType, WorkInputType };
export default WorkType;
