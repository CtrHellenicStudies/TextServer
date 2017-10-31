import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import Author from '../../models/author';
import Work from '../../models/work';

const countFields = {
	authorsCount: {
		type: GraphQLInt,
		args: { },
		resolve(_, {}) {
			const count = Author.count();
			return count.then(
				doc => doc,
				err => console.error(err));
		},
	},
	worksCount: {
		type: GraphQLInt,
		args: { },
		resolve(_, {}) {
			const count = Work.count();
			return count.then(
				doc => doc,
				err => console.error(err));
		},
	},
};

export default countFields;
