import _ from 'underscore';
import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema, GraphQLInt, GraphQLString } from 'graphql';
import { attributeFields } from 'graphql-sequelize';

// models
import Version from '../../models/version';

// logic
import TextNodeService from '../logic/textNodes';

// types
import TextNodeType from './textNode'; // eslint-disable-line
import CtsUrnType from '../../modules/cts/graphql/types/CtsUrn';

/**
 * Version model type
 * @type {GraphQLObjectType}
 */
const VersionType = new GraphQLObjectType({
	name: 'Version',
	description: 'An version of a work (if available)',
	fields: _.assign(attributeFields(Version)),
	extend: {
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
			async resolve(parent, {
				index, urn, location, startsAtLocation, endsAtLocation, startsAtIndex,
				offset,
			}, { token }) {
				const textNodeService = new TextNodeService({ token });
				const textNodes = await textNodeService.textNodesGet(
					index, urn, location, startsAtLocation, endsAtLocation, startsAtIndex,
					offset, null, parent.id,
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
			async resolve(version, { location, offset }, { token }) {
				const textNodeService = new TextNodeService(token);
				return await textNodeService.textLocationNext(null, location, offset, version.id);
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
			async resolve(version, { location, offset }, { token }) {
				const textNodeService = new TextNodeService(token);
				return await textNodeService.textLocationPrev(version.id, location, offset, version.id);
			},
		},
	},
});

export default VersionType;
