import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Work from '../../models/work';

/**
 * Works model type
 * @type {GraphQLObjectType}
 */
const workType = new GraphQLObjectType({
	name: 'Work',
	description: 'A work in a corpus, associated with authors or possibly textgroups',
	fields: _.assign(attributeFields(Work)),
});

export default workType;
