import _ from 'underscore';
import {
	GraphQLObjectType, GraphQLInputObjectType, GraphQLNonNull, GraphQLList,
	GraphQLSchema, GraphQLInt, GraphQLString, GraphQLID
} from 'graphql';
import { attributeFields } from 'graphql-sequelize';

// models
import Work from '../../models/work';

// logic
import TextNodeService from '../logic/textNodes';
import LanguageService from '../logic/languages';
import ExemplarService from '../logic/exemplars';
import TranslationService from '../logic/translations';
import VersionService from '../logic/versions';

// types
import { TextNodeType } from './textNode';
import LanguageType from './language';
import EditionType from './edition';
import VersionType from '../types/version';
import ExemplarType from '../types/exemplar';
import TranslationType from '../types/translation';
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';

/**
 * Works model type
 * @type {GraphQLObjectType}
 */
const WorkType = new GraphQLObjectType({
	name: 'Work',
	description: 'A work in a collection, associated with authors or possibly textgroups',
	fields: {
		id: {
			type: GraphQLInt,
		},
		filemd5hash: {
			type: GraphQLString,
		},
		filename: {
			type: GraphQLString,
		},
		original_title: {
			type: GraphQLString,
		},
		english_title: {
			type: GraphQLString,
		},
		slug: {
			type: GraphQLString,
		},
		structure: {
			type: GraphQLString,
		},
		form: {
			type: GraphQLString,
		},
		urn: {
			type: CtsUrnType,
		},
		language: {
			type: LanguageType,
			resolve(parent, __, { token }) {
				const languageService = new LanguageService({ token });
				return languageService.getLanguage(parent.dataValues.languageId);
			},
		},
		edition: {
			type: EditionType,
		},
		version: {
			type: VersionType,
			resolve(parent, __, { token }) {
				const versionService = new VersionService({ token });
				return versionService.getVersion(parent.dataValues.versionId);
			},
		},
		exemplar: {
			type: ExemplarType,
			resolve(parent, __, { token }) {
				const exemplarService = new ExemplarService({ token });
				return exemplarService.getExemplar(parent.dataValues.exemplarId);
			},
		},
		translation: {
			type: TranslationType,
			resolve(parent, __, { token }) {
				const translationService = new TranslationService({ token });
				return translationService.getTranslation(parent.dataValues.translationId);
			},
		},
		textNodes: {
			type: new GraphQLList(TextNodeType),
			args: {
				index: {
					type: GraphQLInt,
				},
				urn: {
					type: CtsUrnType,
				},
				location: {
					type: new GraphQLList(GraphQLInt),
				},
				startsAtLocation: {
					type: new GraphQLList(GraphQLInt),
				},
				endsAtLocation: {
					type: new GraphQLList(GraphQLInt),
				},
				startsAtIndex: {
					type: GraphQLInt,
				},
				offset: {
					type: GraphQLInt,
				},
			},
			async resolve(work, {
				index, urn, location, startsAtLocation, endsAtLocation, startsAtIndex,
				offset,
			}, { token }) {
				const textNodeService = new TextNodeService({ token });
				const textNodes = await textNodeService.textNodesGet(
					index, urn, location, startsAtLocation, endsAtLocation, startsAtIndex,
					offset, work.id
				);
				return textNodes;
			},
		},
		textLocationNext: {
			type: new GraphQLList(GraphQLInt),
			args: {
				location: {
					type: new GraphQLList(GraphQLInt),
				},
				offset: {
					type: GraphQLInt,
				},
			},
			async resolve(work, { location, offset }, { token }) {
				const textNodeService = new TextNodeService(token);
				return await textNodeService.textLocationNext(work.id, location, offset);
			},
		},
		textLocationPrev: {
			type: new GraphQLList(GraphQLInt),
			args: {
				location: {
					type: new GraphQLList(GraphQLInt),
				},
				offset: {
					type: GraphQLInt,
				},
			},
			async resolve(work, { location, offset }, { token }) {
				const textNodeService = new TextNodeService(token);
				return await textNodeService.textLocationPrev(work.id, location, offset);
			},
		},
	},
});

/**
 * Work input model type
 * @type {GraphQLInputObjectType}
 */
const WorkInputType = new GraphQLInputObjectType({
	name: 'WorkInput',
	description: 'Input type for a work',
	fields: _.assign(attributeFields(Work)),
});

export { WorkType, WorkInputType };
export default WorkType;
