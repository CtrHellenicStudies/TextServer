import PermissionsService from './PermissionsService';
import Version from '../../models/version';

/**
 * Logic-layer service for dealing with versions
 */

export default class VersionService extends PermissionsService {
	/**
	 * Count versions
	 * @returns {number} count of versions
	 */
	count() {
		return Version.count();
	}

	/**
	 * Get a list of versions
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of versions
	 */
	getVersions(textsearch, offset = 0, limit = 100) {
		const args = {
			limit,
			offset,
			order: [
				['slug', 'ASC']
			],
		};

		if (textsearch) {
			args.where = {
				english_name: {
					[Sequelize.Op.like]: `%${textsearch}%`,
				}
			};
		}

		return Version.findAll(args);
	}

	/**
	 * Get version
	 * @param {number} id - id of version
	 * @param {string} slug - id of version
	 * @returns {Object} array of versions
	 */
	getVersion(id, slug) {
		const where = {};

		if (!id && !slug) {
			return null;
		}

		if (id) {
			where.id = id;
		}

		if (slug) {
			where.slug = slug;
		}

		return Version.findOne({ where });
	}
}
