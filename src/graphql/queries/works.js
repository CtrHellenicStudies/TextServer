import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import workType from '../types/work';
import Work from '../../models/work';

const workFields = {
	works: {
		type: new GraphQLList(workType),
		args: {
			offset: {
				type: GraphQLInt,
			},
			limit: {
				type: GraphQLInt,
			},
		},
		resolve(_, { offset }) {
			const query = {
				limit: 21,
			};

			if (offset) {
				query.offset = offset;
			}

			return Work.findAll(query).then(
				doc => doc,
				err => console.error(err));
		},
	},
	work: {
		type: workType,
		args: {
			id: {
				type: GraphQLInt,
			},
			slug: {
				type: GraphQLString,
			},
		},
		resolve(_, { id }) {
			const work = Work.findOne({ where: { id } });
			return work.then(
				doc => doc,
				err => console.error(err));
		},
	},
};

export default workFields;
