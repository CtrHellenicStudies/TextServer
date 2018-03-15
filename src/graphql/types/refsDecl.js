import _ from 'underscore';
import { 
	GraphQLObjectType, GraphQLInputObjectType
} from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import RefsDecl from '../../models/refsDecl';

/**
 * Reference Declaration model type
 * @type {GraphQLObjectType}
 */
const RefsDeclType = new GraphQLObjectType({
	name: 'RefsDecl',
	description: 'A Reference Declaration of a Work, eg. Book, Chapter, Line.',
	fields: _.assign(attributeFields(RefsDecl)),
});

const RefsDeclInputType = new GraphQLInputObjectType({
	name: 'RefsDeclInput',
	description: 'Input type for a reference declaration',
	fields: _.assign(attributeFields(RefsDecl, { exclude: ['id'] })),
});

export { RefsDeclType, RefsDeclInputType };
export default RefsDeclType;

