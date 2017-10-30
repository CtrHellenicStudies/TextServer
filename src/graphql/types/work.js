import {_} from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields} from 'graphql-sequelize';

import Work from '../../models/work';

const workType = new GraphQLObjectType({
	name: 'Work',
	description: 'A work',
	fields: _.assign(attributeFields(Work)),
});

export default workType;
