/**
 * Mutations for text nodes
 */

import {
	GraphQLString,
	GraphQLObjectType,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

// types
import { TextNodeType, TextNodeInputType } from '../types/textNode';
import RemoveType from '../types/remove';

// logic
import TextNodeService from '../logic/textNodes';


const textNodeMutationFields = {
	textNodeCreate: {
		type: TextNodeType,
		description: 'Create new textNode',
		args: {
			textNode: {
				type: new GraphQLNonNull(TextNodeInputType),
			},
		},
		async resolve(parent, { textNode }, { token }) {
			// const textNodeService = new TextNodeService({ token });
			// return await textNodeService.textNodeCreate(textNode);
		}
	},

	textNodeUpdate: {
		type: TextNodeType,
		description: 'Update a piece of text node of a work item.',
		args: {
			id: {
				type: GraphQLInt,
			},
			textNode: {
				type: TextNodeInputType
			}
		},
		async resolve(parent, { id, textNode }, { token }) {
			const textNodeService = new TextNodeService({ token });
			return await textNodeService.textNodeUpdate(id, textNode);
		}
	},

	textNodeRemove: {
		type: RemoveType,
		description: 'Remove a single text node',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, { textNodeId }, { token }) {
			// const textNodeService = new TextNodeService({ token });
			// return await textNodeService.textNodeRemove(textNodeId);
		}
	},
};


export default textNodeMutationFields;
