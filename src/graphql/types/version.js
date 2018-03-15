import _ from 'underscore';
import { GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

// models
import Version from '../../models/version';

/**
 * Version model type
 * @type {GraphQLObjectType}
 */
const VersionType = new GraphQLObjectType({
	name: 'Version',
	description: 'A version/edition of a work item (if available)',
	fields: _.assign(attributeFields(Version)),
});

const VersionInputType = new GraphQLInputObjectType({
	name: 'VersionInput',
	description: 'Input type for a version/edition.',
	fields: _.assign(attributeFields(Version, { exclude: ['id'] })),
});

export { VersionType, VersionInputType };
export default VersionType;
