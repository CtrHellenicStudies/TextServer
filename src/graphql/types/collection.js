import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Collection from '../../models/collection';
import TextGroupType from '../types/textGroup';
import TextGroupService from '../logic/textGroups';
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';


/**
 * Collection model type
 * @type {GraphQLObjectType}
 */
const CollectionType = new GraphQLObjectType({
	name: 'Collection',
	description: 'A collection of texts (usually described as a git repository)',
	fields: {
		..._.assign(attributeFields(Collection)),
		textGroups: {
			type: new GraphQLList(TextGroupType),
			args: {
				textsearch: {
					type: GraphQLString,
				},
				urn: {
					type: CtsUrnType,
				},
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: GraphQLInt,
				},
			},
			async resolve(parent, { textsearch, urn, limit, offset }, { token }) {
				const collectionId = parent.id;
				const textGroupService = new TextGroupService(token);
				return await textGroupService.getTextGroups(textsearch, urn, offset, limit, collectionId);
			},
		},
		textGroup: {
			type: TextGroupType,
			args: {
				id: {
					type: GraphQLInt,
				},
				slug: {
					type: GraphQLString,
				},
			},
			async resolve(parent, { id, slug }, { token }) {
				const collectionId = parent.id;
				const textGroupService = new TextGroupService(token);
				return await textGroupService.getTextGroup(id, slug, collectionId);
			},
		},
	},
});

export default CollectionType;
