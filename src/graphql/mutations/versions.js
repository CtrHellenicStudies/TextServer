import {GraphQLInt} from 'graphql';

// types
import { VersionType, VersionInputType } from '../types/version';

// logic
import VersionService from '../logic/versions';

const versionsMutationFields = {
	versionUpdate: {
		type: VersionType,
		
		description: 'Update a version/edition of a work item or text node.',
		args: {
			id: {
				type: GraphQLInt,
			},
			version: {
				type: VersionInputType
			}
		},
		async resolve(parent, { id, version }, { token }) {
			const versionService = new VersionService({ token });
			return await versionService.versionUpdate(id, version);
		}
		
	}
};

export default versionsMutationFields;
