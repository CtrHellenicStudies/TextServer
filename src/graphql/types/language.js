import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Language from '../../models/language';


/**
 * Language model type
 * @type {GraphQLObjectType}
 */
const LanguageType = new GraphQLObjectType({
	name: 'Language',
	description: 'A language of a work or text node',
	fields: _.assign(attributeFields(Language)),
});

export default LanguageType;
