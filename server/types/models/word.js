import createType from 'mongoose-schema-to-graphql';

import Word from '../../models/word';

const config = {
	name: 'wordType',
	description: 'Word base schema',
	class: 'GraphQLObjectType',
	schema: Word.schema,
	exclude: ['_id'],
};

const wordType = createType(config);

export default wordType;
