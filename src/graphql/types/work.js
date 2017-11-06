import _ from 'underscore';
import {
	GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull, GraphQLList,
	GraphQLSchema, GraphQLInt, GraphQLString
} from 'graphql';
import { attributeFields } from 'graphql-sequelize';

import Work from '../../models/work';
import { TextNodeType } from './textNode';

/**
 * Works model type
 * @type {GraphQLObjectType}
 */
const WorkType = new GraphQLObjectType({
	name: 'Work',
	description: 'A work in a collection, associated with authors or possibly textgroups',
	fields: {
		textNodes: {
			type: new GraphQLList(TextNodeType),
			args: {
				index: { type: GraphQLInt },
				slug : { type: GraphQLString },
				location: { type: new GraphQLList(GraphQLInt) },
				startsAtLocation: { type: new GraphQLList(GraphQLInt) },
				startsAtIndex: { type: GraphQLInt },
				offset: { type: GraphQLInt },
			},
			resolve(parent, { location, offset, index, startsAtLocation, startsAtIndex }) {

				const query = {
					where: {
						workid,
					},
					order: ['index'],
					limit: 30,
				};

				if (location) {
					query.where.location = location;
				}

				if (index) {
					query.where.index = index;
				}

				if (startsAtIndex) {
					query.where.index = {
						$gte: startsAtIndex,
					};
				}

				if (offset) {
					query.offset = offset;
				}

				if (startsAtLocation) {
					query.where.location = startsAtLocation;
					return TextNode.findOne(query).then((node) => {

						if (!node) {
							// TODO: Handle error

							return null;
						}

						delete query.where.location;

						query.where.index = {
							$gte: node.index,
						};

						return TextNode.findAll(query).then(
							doc => doc,
							err => console.error(err));
					});
				}

				return TextNode.findAll(query).then(
					doc => doc,
					err => console.error(err));
			},
		},
	},
});

/**
 * Work input model type
 * @type {GraphQLInputObjectType}
 */
const WorkInputType = new GraphQLInputObjectType({
	name: 'WorkInput',
	description: 'Input type for a work',
	fields: _.assign(attributeFields(Work)),
});

export { WorkType, WorkInputType };
export default WorkType;
