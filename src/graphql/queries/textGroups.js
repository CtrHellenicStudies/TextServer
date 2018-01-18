import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import TextGroupType from '../types/textGroup';
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';
import TextGroupService from '../logic/textGroups';

const textGroupFields = {
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
		async resolve(_, { textsearch, urn, limit, offset }, { token }) {
			const textGroupService = new TextGroupService(token);
			return await textGroupService.getTextGroups(textsearch, urn, offset, limit);
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
		async resolve(_, { id, slug }, { token }) {
			const textGroupService = new TextGroupService(token);
			return await textGroupService.getTextGroup(id, slug);
		},
	},
};

export default textGroupFields;
