import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import WorkType from '../types/work';
import WorkService from '../logic/works';

const workFields = {
	works: {
		type: new GraphQLList(WorkType),
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
			const workService = new WorkService(token);
			return await workService.getWorks(textsearch, limit, offset);
		},
	},
	work: {
		type: WorkType,
		args: {
			id: {
				type: GraphQLInt,
			},
			slug: {
				type: GraphQLString,
			},
		},
		async resolve(_, { id, slug }, { token }) {
			const workService = new WorkService(token);
			return await workService.getWork(id, slug);
		},
	},
};

export default workFields;
