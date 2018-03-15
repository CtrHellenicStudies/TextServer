import PermissionsService from './PermissionsService';
import RefsDecl from '../../models/refsDecl';

/**
 * Logic-layer service for dealing with reference declaration
 */

export default class RefsDeclService extends PermissionsService {
	/**
	 * Count refsdecls
	 * @returns {number} count of refsdecls
	 */
	count() {
		return RefsDecl.count();
	}

	/**
	 * Get a list of refsdecls
	 * @param {number} workId
	 * @returns {Object[]} array of refsdecls
	 */
	getRefsDecls(workId = null) {
		const args = {
			where: {},
			order: [
				['structure_index', 'ASC']
			],
		};

		if (workId) {
			args.where.workId = workId;
		}

		return RefsDecl.findAll(args);
	}

	/**
	 * Get refsDecl
	 * @param {number} id - id of refsDecl
	 * @param {string} workId - id of the work item  for the refsDecl
	 * @returns {Object} array of refsdecls
	 */
	getRefsDecl(id, workId) {
		const where = {};

		if (id) {
			where.id = id;
		}

		if (workId) {
			where.workId = workId;
		}

		return RefsDecl.findOne({ where });
	}

	/**
	 * Update a reference declaration
	 * @param {string} id - id of refsDecl
	 * @param {Object} refsDecl
	 * @returns {boolean} 
	 */
	async refsDeclUpdate(id, refsDecl) {

		if (this.userIsAdmin) {
			const refsDeclModify = await RefsDecl.findById(id);
			refsDeclModify.updateAttributes(refsDecl);
			return refsDeclModify.save();
		} 

		return new Error('Not authorized');
	}
	
}
