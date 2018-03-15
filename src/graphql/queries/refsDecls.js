import { GraphQLInt } from 'graphql';

import RefsDeclType from '../types/refsDecl';
import RefsDeclService from '../logic/refsDecls';

const refsDeclFields = {
	refsDecl: {
		type: RefsDeclType,
		args: {
			id: {
				type: GraphQLInt,
			}
		},
		async resolve(_, { id }, { token }) {
			const refsDeclService = new RefsDeclService(token);
			return await refsDeclService.getRefsDecl(id);
		},
	},
};

export default refsDeclFields;
