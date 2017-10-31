import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import WorkType from '../types/work';

const workFields = {
	works: {
		type: new GraphQLList(WorkType),
		args: {
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { limite, offset }, { token }) {
			const workService = new WorkService(token);
			return await workService.getWorks(limit, offset);
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
			return await workService.getWorks(limit, offset);
		},
	},
};

export default workFields;
