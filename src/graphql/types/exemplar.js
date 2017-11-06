import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Exemplar from '../../models/exemplar';

/**
 * Exemplar model type
 * @type {GraphQLObjectType}
 */
const ExemplarType = new GraphQLObjectType({
	name: 'Exemplar',
	description: 'An exemplar of a work (if available)',
	fields: _.assign(attributeFields(Exemplar)),
});

export default ExemplarType;
