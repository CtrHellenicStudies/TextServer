import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import TextGroup from '../../models/textGroup';
import WorkType from './work'; // eslint-disable-line
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
				const textGroupId = parent.id;
				const workService = new WorkService(token);
				return await workService.getWorks(textsearch, offset, limit, textGroupId);
			},
		},
		work: {
			type: WorkType,
			args: {
				id: {
					type: GraphQLInt,
				},
				slug: {
					type: GraphQLString,
				},
				urn: {
					type: GraphQLString,
				},
			},
			async resolve(parent, { id, slug, urn }, { token }) {
				const textGroupId = parent.id;
				const workService = new WorkService(token);
				return await workService.getWork(id, slug, urn, textGroupId);
			},
		},
	},
});

export default TextGroupType;
