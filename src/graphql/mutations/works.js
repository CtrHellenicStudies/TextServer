/**
 * Mutations for works
 */

import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';

// types
import { WorkType, WorkInputType } from '../types/work';
import RemoveType from '../types/remove';

// logic
import WorksService from '../logic/works';

const worksMutationFields = {
	workCreate: {
		type: WorkType,
		description: 'Create a new work',
		args: {
			work: {
				type: WorkInputType
			}
		},
		async resolve(parent, { work }, {token}) {
			const worksService = new WorksService({token});
			return await worksService.workInsert(work);
		}
	},
	workUpdate: {
		type: WorkType,
		description: 'Update a work',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLInt)
			},
			work: {
				type: new GraphQLNonNull(WorkInputType)
			}
		},
		async resolve(parent, { id, work }, {token}) {
			const worksService = new WorksService({token});
			return await worksService.workUpdate(id, work);
		}
	},
	workRemove: {
		type: RemoveType,
		description: 'Remove a single work',
		args: {
			workId: {
				type: new GraphQLNonNull(GraphQLInt)
			}
		},
		async resolve(parent, {workId}, {token}) {
			const worksService = new WorksService({token});
			return await worksService.workRemove(workId);
		}
	}
};

export default worksMutationFields;
