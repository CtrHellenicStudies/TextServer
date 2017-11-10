import { GraphQLObjectType } from 'graphql';

import authorFields from './authors';
import collectionFields from './collections';
import languageFields from './languages';
import workFields from './works';
import countFields from './counts';

/**
 * Root Query
 * @type {GraphQLObjectType}
 */
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		...authorFields,
		...collectionFields,
		...languageFields,
		...workFields,
		...countFields,
	}
});

export default RootQuery;
