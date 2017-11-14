import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import TextGroupType from '../types/textGroup';
import TextGroupService from '../logic/textGroups';

const textGroupFields = {
	textGroups: {
		type: new GraphQLList(TextGroupType),
		args: {
			textsearch: {
				type: GraphQLString,
			},
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { textsearch, limit, offset }, { token }) {
			const textGroupService = new TextGroupService(token);
			return await textGroupService.getTextGroups(textsearch, offset, limit);
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
			urn: {
				type: GraphQLString,
			},
		},
		async resolve(_, { id, slug, urn }, { token }) {
			const textGroupService = new TextGroupService(token);
			return await textGroupService.getTextGroup(id, slug, urn);
		},
	},
};

export default textGroupFields;
