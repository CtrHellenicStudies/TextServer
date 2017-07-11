import { GraphQLObjectType } from 'graphql';

import languageFields from './languages';

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		...languageFields,
	}
});

export default RootQuery;
