import { GraphQLString } from 'graphql';

import projectType from '../types/models/project';
import Project from '../models/project';

const projectFileds = {
	projectByTitle: {
		type: projectType,
		args: { title: { type: GraphQLString } },
		resolve(_, {title}) {
			const projectDoc = Project.findOne({ title });
			return projectDoc.then(
				doc => doc,
				err => console.error(err));
		},
	},
	projectById: {
		type: projectType,
		args: { _id: { type: GraphQLString } },
		resolve(parent, {_id}) {
			const projectDoc = Project.findById(_id);
			return projectDoc.then(
				doc => doc,
				err => console.error(err));
		},
	},
};

export default projectFileds;
