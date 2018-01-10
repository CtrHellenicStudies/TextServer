import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import AuthorService from '../logic/authors';
import CollectionService from '../logic/collections';
import LanguageService from '../logic/languages';
import TextGroupService from '../logic/textGroups';
import WorkService from '../logic/works';

const countFields = {
	authorsCount: {
		type: GraphQLInt,
		async resolve(_, __, { token }) {
			const authorService = new AuthorService(token);
			return await authorService.count();
		},
	},
	collectionsCount: {
		type: GraphQLInt,
		async resolve(_, __, { token }) {
			const collectionService = new CollectionService(token);
			return await collectionService.count();
		},
	},
	languagesCount: {
		type: GraphQLInt,
		async resolve(_, __, { token }) {
			const languageService = new LanguageService(token);
			return await languageService.count();
		},
	},
	textGroupsCount: {
		type: GraphQLInt,
		async resolve(_, __, { token }) {
			const textGroupService = new TextGroupService(token);
			return await textGroupService.count();
		},
	},
	worksCount: {
		type: GraphQLInt,
		async resolve(_, __, { token }) {
			const workService = new WorkService(token);
			return await workService.count();
		},
	},
};

export default countFields;
