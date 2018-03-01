import { GraphQLObjectType } from 'graphql';

import authorFields from './authors';
import collectionFields from './collections';
import languageFields from './languages';
import textGroupFields from './textGroups';
import textNodeFields from './textNodes';
import workFields from './works';
import countFields from './counts';
import perseusCtsFields from '../../modules/perseus/graphql/queries/perseusCts';
import lightWeightCtsFields from '../../modules/lightWeightCts/graphql/queries/lightWeightCts';

/**
 * Root Query
 * @type {GraphQLObjectType}
 */
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		...authorFields,
		...collectionFields,
		...textGroupFields,
		...textNodeFields,
		...languageFields,
		...workFields,
		...countFields,
		...perseusCtsFields,
		...lightWeightCtsFields
	}
});

export default RootQuery;
