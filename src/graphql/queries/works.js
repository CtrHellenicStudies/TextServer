import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import WorkType from '../types/work'; // eslint-disable-line
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';
import WorkService from '../logic/works';

const workFields = {
	works: {
		type: new GraphQLList(WorkType),
		args: {
			textsearch: {
				type: GraphQLString,
			},
			urn: {
				type: CtsUrnType,
			},
			language: {
				type: GraphQLString,
			},
			limit: {
				type: GraphQLInt,
			},
			offset: {
				type: GraphQLInt,
			},
		},
		async resolve(_, { textsearch, urn, language, limit, offset }, { token }) {
			const workService = new WorkService(token);
			console.log(textsearch, urn, language, limit, offset);
			const works = await workService.getWorks(textsearch, urn, language, offset, limit);
			return works;
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
