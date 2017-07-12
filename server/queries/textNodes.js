import { GraphQLString, GraphQLInt, GraphQLList } from 'graphql';

import textNodeType from '../types/models/textNode';
import TextNode from '../models/textNode';
import Work from '../models/work';

const textNodeFields = {
	textNodesByWorkId: {
		type: new GraphQLList(textNodeType),
		args: {
			id: { type: GraphQLInt }
		},
		resolve(_, { id }) {

			const textNodes = TextNode.findAll({ where: {
				workid: id,
			}, order: ['index']});

			return textNodes.then(
				doc => doc,
				err => console.error(err));
		},
	},
	textNodesByWorkSlug: {
		type: new GraphQLList(textNodeType),
		args: {
			slug: { type: GraphQLString }
		},
		resolve(_, { slug }) {
			return Work.findOne({ where: { slug } })
				.then((work) => {
					const textNodes = TextNode.findAll({ where: {
						workid: work.id,
					}, order: ['index'] });

					return textNodes.then(
						doc => doc,
						err => console.error(err));
				});
		},
	},
};

export default textNodeFields;
