import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import TextGroup from '../../models/textGroup';
import WorkType from './work';
import WorkService from '../logic/works';

/**
 * TextGroup model type
 * @type {GraphQLObjectType}
 */
const TextGroupType = new GraphQLObjectType({
	name: 'TextGroup',
	description: 'A textGroup in a collection',
	fields: {
		..._.assign(attributeFields(TextGroup)),
		works: {
			type: new GraphQLList(WorkType),
			args: {
				textsearch: {
					type: GraphQLString,
				},
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: GraphQLInt,
				},
			},
			async resolve(parent, { textsearch, offset, limit }, { token }) {
				const workService = new WorkService(token);
				const textGroupId = parent.id;
				return await workService.getWorks(textsearch, offset, limit, textGroupId);
			},
		},
	},
});

export default TextGroupType;
