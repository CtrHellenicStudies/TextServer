import { GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';

import textNodeType from '../types/models/textNode';
import TextNode from '../models/textNode';
import Work from '../models/work';

const textNodeFields = {
	textNodesByWork: {
		type: new GraphQLList(textNodeType),
		args: {
			workid: { type: GraphQLInt },
			index: { type: GraphQLInt },
			slug : { type: GraphQLString },
			location: { type: new GraphQLList(GraphQLInt) },
			startsAtLocation: { type: new GraphQLList(GraphQLInt) },
			startsAtIndex: { type: GraphQLInt },
			offset: { type: GraphQLInt },
		},
		resolve(_, { workid, location, offset, index, startsAtLocation, startsAtIndex}) {

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
	textLocationNext: {
		type: new GraphQLList(GraphQLInt),
		args: {
			workid: { type: GraphQLInt },
			location: { type: new GraphQLList(GraphQLInt) },
			offset: { type: GraphQLInt },
		},
		resolve(_, { workid, location, offset}) {
			const query = {
				where: {
					workid,
				 	location,
				},
			}
			return TextNode.findOne(query).then((node) => {
				delete query.where.location;

				query.where.index = {
					$gte: node.index
				};

				query.limit = offset;
				query.order = ['index'];

				return TextNode.findAll(query).then((nodes) => {
					if (!nodes || !nodes.length || !node.length === offset) {
						return [];
					}

					return nodes[nodes.length - 1].location;
				});
			});
		}
	},
	textLocationPrev: {
		type: new GraphQLList(GraphQLInt),
		args: {
			workid: { type: GraphQLInt },
			location: { type: new GraphQLList(GraphQLInt) },
			offset: { type: GraphQLInt },
		},
		resolve(_, { workid, location, offset}) {
			const query = {
				where: {
					workid,
				 	location,
				},
			}
			return TextNode.findOne(query).then((node) => {
				delete query.where.location;

				query.where.index = {
					$lt: node.index,
				};
				query.order = [['index', 'DESC']];
				query.limit = offset;

				return TextNode.findAll(query).then((nodes) => {
					if (!nodes || !nodes.length) {
						return [];
					}

					return nodes[nodes.length - 1].location;
				});
			});
		}
	},
};

export default textNodeFields;
