import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import TextGroup from '../../models/textGroup';
import WorkType from './work'; // eslint-disable-line
import WorkService from '../logic/works';
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';

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
				urn: {
					type: CtsUrnType,
				},
				language: {
					type: GraphQLString,
				},
				edition: {
					type: GraphQLString,
				},
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: GraphQLInt,
				},
			},
			async resolve(parent, { textsearch, urn, language, edition, limit, offset }, { token }) {
				const textGroupId = parent.id;
				const workService = new WorkService(token);
				return await workService.getWorks(textsearch, urn, offset, limit, language, edition, textGroupId);
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
			},
			async resolve(parent, { id, slug }, { token }) {
				const textGroupId = parent.id;
				const workService = new WorkService(token);
				return await workService.getWork(id, slug, textGroupId);
			},
		},
	},
});

export default TextGroupType;
