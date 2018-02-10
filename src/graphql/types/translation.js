import _ from 'underscore';
import { 
	GraphQLObjectType, GraphQLInputObjectType, 
	GraphQLNonNull, GraphQLList, 
	GraphQLSchema, GraphQLInt, 
	GraphQLString 
} from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Translation from '../../models/translation';

/**
 * Translation model type
 * @type {GraphQLObjectType}
 */
const TranslationType = new GraphQLObjectType({
	name: 'Translation',
	description: 'An translation of a work (if available)',
	fields: _.assign(attributeFields(Translation)),
});

const TranslationInputType = new GraphQLInputObjectType({
	name: 'TranslationInput',
	description: 'Input type for a translation',
	fields: _.assign(attributeFields(Translation)),
});

export { TranslationType, TranslationInputType };
export default TranslationType;
