import PermissionsService from './PermissionsService';
import Translation from '../../models/translation';

/**
 * Logic-layer service for dealing with translations
 */

export default class TranslationService extends PermissionsService {
	/**
	 * Count translations
	 * @returns {number} count of translations
	 */
	count() {
		return Translation.count();
	}

	/**
	 * Get a list of translations
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of translations
	 */
	getTranslations(textsearch, offset = 0, limit = 100, workId = null) {
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

		return Translation.findAll(args);
	}

	/**
	 * Get translation
	 * @param {number} id - id of translation
	 * @param {string} slug - id of translation
	 * @returns {Object} array of translations
	 */
	getTranslation(id, slug) {
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

		if (workId) {
			where.workId = workId;
		}

		return Translation.findOne({ where });
	}
}
