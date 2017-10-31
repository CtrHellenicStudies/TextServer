import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Corpus from '../../models/corpus';


/**
 * Corpus model type
 * @type {GraphQLObjectType}
 */
const corpusType = new GraphQLObjectType({
	name: 'Corpus',
	description: 'A corpus of texts (usually described as a git repository)',
	fields: _.assign(attributeFields(Corpus)),
});

export default corpusType;
