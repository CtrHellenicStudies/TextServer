import createType from 'mongoose-schema-to-graphql';

import Wordlist from '../../models/wordlist';

const config = {
	name: 'wordlistType',
	description: 'Wordlist base schema',
	class: 'GraphQLObjectType',
	schema: Wordlist.schema,
	exclude: ['_id'],
};

const wordlistType = createType(config);

export default wordlistType;
