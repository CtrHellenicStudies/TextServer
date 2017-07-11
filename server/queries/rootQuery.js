import { GraphQLObjectType } from 'graphql';

import authorFields from './authors';
import corpusFields from './corpora';
import languageFields from './languages';
import textNodeFields from './textNodes';
import workFields from './works';

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		...authorFields,
		...corpusFields,
		...languageFields,
		...textNodeFields,
		...workFields,
	}
});

export default RootQuery;
