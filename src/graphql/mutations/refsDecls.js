/**
 * Mutations for reference declarations
 */

import {GraphQLInt} from 'graphql';

// types
import { RefsDeclType, RefsDeclInputType } from '../types/refsDecl';

// logic
import RefsDeclService from '../logic/refsDecls';

const refsDeclsMutationFields = {
	refsDeclUpdate: {
		type: RefsDeclType,
		description: 'Update a reference declaration',
		args: {
			id: {
				type: GraphQLInt,
			},
			refsDecl: {
				type: RefsDeclInputType
			}
		},
		async resolve(parent, { id, refsDecl }, { token }) {
			const refsDeclService = new RefsDeclService({ token });
			return await refsDeclService.refsDeclUpdate(id, refsDecl);
		}
	}
};

export default refsDeclsMutationFields;
