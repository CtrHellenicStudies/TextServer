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
import TextNodeType from './textNode'; // eslint-disable-line
import LanguageType from './language';
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
				return versionService.getVersion(id, slug, parent.dataValues.id);
			},
		},
		versions: {
			type: new GraphQLList(VersionType),
			args: {
				textsearch: {
					type: GraphQLString,
				},
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: GraphQLInt,
				},
			},
			resolve(parent, { textsearch, limit, offset }, { token }) {
				const versionService = new VersionService({ token });
				return versionService.getVersions(textsearch, limit, offset, parent.dataValues.id);
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
				return exemplarService.getExemplar(id, slug, parent.dataValues.id);
			},
		},
		exemplars: {
			type: new GraphQLList(ExemplarType),
			args: {
				textsearch: {
					type: GraphQLString,
				},
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: GraphQLInt,
				},
			},
			resolve(parent, { textsearch, limit, offset }, { token }) {
				const exemplarService = new ExemplarService({ token });
				return exemplarService.getExemplars(textsearch, limit, offset, parent.dataValues.id);
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
				return translationService.getTranslation(id, slug, parent.dataValues.id);
			},
		},
		translations: {
			type: new GraphQLList(TranslationType),
			args: {
				textsearch: {
					type: GraphQLString,
				},
				limit: {
					type: GraphQLInt,
				},
				offset: {
					type: GraphQLInt,
				},
			},
			resolve(parent, { textsearch, limit, offset }, { token }) {
				const translationService = new TranslationService({ token });
				return translationService.getTranslations(textsearch, limit, offset, parent.dataValues.id);
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
