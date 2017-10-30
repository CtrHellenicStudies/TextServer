import createType from 'mongoose-schema-to-graphql';

import Project from '../../models/project';

const config = {
	name: 'projectType',
	description: 'Project base schema',
	class: 'GraphQLObjectType',
	schema: Project.schema,
	exclude: ['_id'],
};

const projectType = createType(config);

export default projectType;
