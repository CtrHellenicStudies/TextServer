import _ from 'underscore';
import {
	GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLList, GraphQLInt
} from 'graphql';
import { attributeFields } from 'graphql-sequelize';

// models
import TextNode from '../../models/textNode';

// logic
import TextNodeService from '../logic/textNodes';
import LanguageService from '../logic/languages';
import ExemplarService from '../logic/exemplars';
import TranslationService from '../logic/translations';
import VersionService from '../logic/versions';
import WorkService from '../logic/works';

// types
import WordType from './word';
import LanguageType from './language';
import VersionType from '../types/version';
import ExemplarType from '../types/exemplar';
import TranslationType from '../types/translation';
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';



/**
 * Text Nodes model type
 * @type {GraphQLObjectType}
 */
const TextNodeType = new GraphQLObjectType({
	name: 'TextNode',
	description: 'A textNode in a work, similar to data model from Draft.js',
	fields: {
		..._.assign(attributeFields(TextNode)),
		urn: {
			type: CtsUrnType,
			resolve(parent, __, { token }) {
				const textNodeService = new TextNodeService({ token });
				return textNodeService.getTextNodeURN(parent);
			},
		},
		words: {
			type: new GraphQLList(WordType),
			resolve(parent, __, { token }) {
				const textNodeService = new TextNodeService({ token });
				return textNodeService.getTextNodeWords(parent);
			},
		},
		language: {
			type: LanguageType,
			async resolve(parent, __, { token }) {
				// queries could possibly be combined in the future for performance
				const workService = new WorkService({ token });
				const work = await workService.getWork(parent.dataValues.workId);

				const languageService = new LanguageService({ token });
				const language = await languageService.getLanguage(work.languageId);
				return language;
			},
		},
		version: {
			type: VersionType,
			args: {
				id: {
					type: GraphQLInt,
				},
				slug: {
					type: GraphQLString,
				},
			},
			resolve(parent, { id, slug }, { token }) {
				const versionService = new VersionService({ token });
				return versionService.getVersion(id, slug, parent.dataValues.workId);
			},
		},
		exemplar: {
			type: ExemplarType,
			args: {
				id: {
					type: GraphQLInt,
				},
				slug: {
					type: GraphQLString,
				},
			},
			resolve(parent, { id, slug }, { token }) {
				const exemplarService = new ExemplarService({ token });
				return exemplarService.getExemplar(id, slug, parent.dataValues.workId);
			},
		},
		translation: {
			type: TranslationType,
			args: {
				id: {
					type: GraphQLInt,
				},
				slug: {
					type: GraphQLString,
				},
			},
			resolve(parent, { id, slug }, { token }) {
				const translationService = new TranslationService({ token });
				return translationService.getTranslation(id, slug, parent.dataValues.workId);
			},
		},
	},
});

/**
 * Text Nodes input model type
 * @type {GraphQLInputObjectType}
 */
const TextNodeInputType = new GraphQLInputObjectType({
	name: 'TextNodeInput',
	description: 'Input type for a textNode in a work, similar to data model from Draft.js',
	fields: _.assign(attributeFields(TextNode)),
});

export { TextNodeType, TextNodeInputType };
export default TextNodeType;
