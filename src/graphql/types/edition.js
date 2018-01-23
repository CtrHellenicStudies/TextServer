import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';

// logic
import ExemplarService from '../logic/exemplars';
import TranslationService from '../logic/translations';
import VersionService from '../logic/versions';
import TextNodeService from '../logic/textNodes';

// types
import VersionType from '../types/version';
import ExemplarType from '../types/exemplar';
import TranslationType from '../types/translation';
import TextNodeType from '../types/textNode'; // eslint-disable-line
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';

/**
 * Edition type
 * @type {GraphQLObjectType}
 */
const EditionType = new GraphQLObjectType({
	name: 'Edition',
	description: 'An edition comprising optional version, exemplar, and translation',
	fields: {
		version: {
			type: VersionType,
			args: {
				urn: {
					type: CtsUrnType,
				},
			},
			resolve(parent, __, { token }) {
				console.log(parent.dataValues);
				console.log('#####');
				const versionService = new VersionService({ token });
				return versionService.getVersion(parent);
			},
		},
		exemplar: {
			type: ExemplarType,
			args: {
				urn: {
					type: CtsUrnType,
				},
			},
			resolve(parent, __, { token }) {
				const exemplarService = new ExemplarService({ token });
				return exemplarService.getExemplar(parent);
			},
		},
		translation: {
			type: TranslationType,
			args: {
				urn: {
					type: CtsUrnType,
				},
			},
			resolve(parent, __, { token }) {
				const translationService = new TranslationService({ token });
				return translationService.getTranslation(parent);
			},
		},
	},
});

export default EditionType;
