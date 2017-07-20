import { GraphQLString, GraphQLInt, GraphQLList } from 'graphql';

import textNodeType from '../types/models/textNode';
import TextNode from '../models/textNode';
import Work from '../models/work';

const textNodeFields = {
	textNodesByWork: {
		type: new GraphQLList(textNodeType),
		args: {
			id: { type: GraphQLInt },
			index: { type: GraphQLInt },
			slug : { type: GraphQLString },
			location: { type: new GraphQLList(GraphQLInt) },
			startsAtLocation: { type: new GraphQLList(GraphQLInt) },
			startsAtIndex: { type: GraphQLInt },
			offset: { type: GraphQLInt },
		},
		resolve(_, { id, location, offset, index, startsAtLocation, startsAtIndex}) {

			const query = {
				where: {
					workid: id
				},
				order: ['index'],
				limit: 100,
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
};

export default textNodeFields;
