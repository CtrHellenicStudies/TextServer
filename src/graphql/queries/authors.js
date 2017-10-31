import { GraphQLString, GraphQLList } from 'graphql';

import authorType from '../types/author';
import Author from '../../models/author';

const authorFields = {
	authors: {
		type: new GraphQLList(authorType),
		args: { },
		resolve(_, {}) {
			const authors = Author.findAll();
			return authors.then(
				doc => doc,
				err => console.error(err));
		},
	},
	author: {
		type: authorType,
		args: {
			slug: {
				type: GraphQLString,
			}, 
		},
		resolve(_, {slug}) {
			const author = Author.findOne({ where: { slug } });
			return author.then(
				doc => doc,
				err => console.error(err));
		},
	},
};

export default authorFields;
