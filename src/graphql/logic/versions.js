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
	 * @param {number} workId
	 * @returns {Object[]} array of versions
	 */
	getVersions(textsearch, offset = 0, limit = 100, workId = null) {
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

		return Version.findAll(args);
	}

	/**
	 * Get version
	 * @param {number} id - id of version
	 * @param {string} slug - slug of version
	 * @param {string} workId - id of work for version
	 * @returns {Object} array of versions
	 */
	getVersion(id, slug, workId) {
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

		return Version.findOne({ where });
	}

	/**
	 * update version/edition
	 */
	async versionUpdate(id, version) {

		if (this.userIsAdmin) {
			const versionInstance = await Version.findById(id);
			versionInstance.updateAttributes(version);
			return versionInstance.save();
		} 

		return new Error('Not authorized');
	}
}
