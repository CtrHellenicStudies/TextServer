import PermissionsService from './PermissionsService';
import Exemplar from '../../models/exemplar';

/**
 * Logic-layer service for dealing with exemplars
 */

export default class ExemplarService extends PermissionsService {
	/**
	 * Count exemplars
	 * @returns {number} count of exemplars
	 */
	count() {
		return Exemplar.count();
	}

	/**
	 * Get a list of exemplars
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of exemplars
	 */
	getExemplars(textsearch, offset = 0, limit = 100, workId = null) {
		const args = {
			where: {},
			limit,
			offset,
			order: [
				['slug', 'ASC']
			],
		};

		if (textsearch) {
			args.where.title = {
				[Sequelize.Op.like]: `%${textsearch}%`,
			};
		}

		if (workId) {
			args.where.workId = workId;
		}

		return Exemplar.findAll(args);
	}

	/**
	 * Get exemplar
	 * @param {number} id - id of exemplar
	 * @param {string} slug - id of exemplar
	 * @returns {Object} array of exemplars
	 */
	getExemplar(id, slug, workId) {
		const where = {};

		/**
		 * Intentionally return first default result
		if (!id && !slug) {
			return null;
		}
		*/

		if (id) {
			where.id = id;
		}

		if (slug) {
			where.slug = slug;
		}

		if (workId) {
			where.workId = workId;
		}

		return Exemplar.findOne({ where });
	}
}
