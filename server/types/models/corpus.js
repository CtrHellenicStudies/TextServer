import {_} from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields} from 'graphql-sequelize';

import Corpus from '../../models/corpus';

const corpusType = new GraphQLObjectType({
	name: 'Corpus',
	description: 'A corpus',
	fields: _.assign(attributeFields(Corpus)),
});

export default corpusType;
