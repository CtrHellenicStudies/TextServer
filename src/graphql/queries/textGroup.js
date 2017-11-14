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
			return await textGroupService.getTextGroups(textsearch, limit, offset);
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
			return await textGroupService.getTextGroups(limit, offset);
		},
	},
};

export default textGroupFields;
