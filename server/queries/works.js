import { GraphQLString, GraphQLList } from 'graphql';

import workType from '../types/models/work';
import Work from '../models/work';

const workFields = {
	works: {
		type: new GraphQLList(workType),
		args: { },
		resolve(_, {}) {
			const works = Work.findAll();
			return works.then(
				doc => doc,
				err => console.error(err));
		},
	},
	worksByLanguage: {
		type: new GraphQLList(workType),
		args: { language: { type: GraphQLString } },
		resolve(_, {language}) {
			const works = Work.findAll({ where: { language } });
			return works.then(
				doc => doc,
				err => console.error(err));
		},
	},
	workBySlug: {
		type: workType,
		args: { slug: { type: GraphQLString } },
		resolve(_, {slug}) {
			const work = Work.findOne({ where: { slug } });
			return work.then(
				doc => doc,
				err => console.error(err));
		},
	},
};

export default workFields;
