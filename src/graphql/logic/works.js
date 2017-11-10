import Sequelize from 'sequelize';

import PermissionsService from './PermissionsService';
import Work from '../../models/work';

/**
 * Logic-layer service for dealing with works
 */
export default class WorkService extends PermissionsService {
	/**
	 * Create a work
	 * @param {Object} work - candidate work to create
	 * @returns {Object} newly created work
	 */
	insert(work) {
		if (this.userIsAdmin) {
			const newWork = work;
			newWork.subworks = this.rewriteSubworks(work.subworks);

			const workId = Work.insert({...newWork});
			return Work.findOne(workId);
		}
		return new Error('Not authorized');
	}

	/**
	 * Update a work
	 * @param {string} _id - id of work
	 * @param {Object} work - work to update
	 * @returns {boolean} result from mongo orm update
	 */
	update(_id, work) {
		if (this.userIsAdmin) {
			const newWork = work;
			newWork.subworks = this.rewriteSubworks(work.subworks);

			return Work.update(_id, {$set: newWork});
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a work
	 * @param {string} _id - id of work
	 * @returns {boolean} result from mongo orm remove
	 */
	remove(_id) {
		if (this.userIsAdmin) {
			return Work.remove({ _id });
		}
		return new Error('Not authorized');
	}

	/**
	 * Get works
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of works
	 */
	getWorks(textsearch, urn, offset = 0, limit = 100) {
		const args = {};

		if (textsearch) {
			args.where = {
				english_title: {
					[Sequelize.Op.like]: `%${textsearch}%`,
				}
			};
		}

		if (urn) {
			if (!('where' in args)) {
				args.where = {};
			}
			args.where.urn = {
				[Sequelize.Op.like]: `%${urn}%`,
			};
		}

		return Work.findAll(args, {
			limit,
			offset,
			order: [
				['slug', 'ASC']
			]
		});
	}

	/**
	 * Get work
	 * @param {number} id - id of work
	 * @param {string} slug - id of work
	 * @returns {Object} array of works
	 */
	getWork(id, slug) {
		const where = {};

		if (id) {
			where.id = id;
		}

		if (slug) {
			where.slug = slug;
		}

		return Work.findOne(where);
	}

	/**
	 * Count works
	 * @returns {number} count of works
	 */
	count() {
		return Work.count();
	}
}
