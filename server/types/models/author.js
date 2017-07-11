import {_} from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields} from 'graphql-sequelize';

import Author from '../../models/author';

const authorType = new GraphQLObjectType({
	name: 'Author',
	description: 'A author',
	fields: _.assign(attributeFields(Author)),
});

export default authorType;
