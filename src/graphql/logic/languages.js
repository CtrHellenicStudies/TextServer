import PermissionsService from './PermissionsService';
import Language from '../../models/language';

/**
 * Logic-layer service for dealing with languages
 */

export default class LanguageService extends PermissionsService {
	/**
	 * Count languages
	 * @returns {number} count of languages
	 */
	count() {
		return Language.count();
	}

	/**
	 * Get a list of languages
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of languages
	 */
	getLanguages(textsearch, offset = 0, limit = 100) {
		const args = {
			limit,
			offset,
			order: [
				['slug', 'ASC']
			],
		};

		if (textsearch) {
			args.where = {
				title: {
					[Sequelize.Op.like]: `%${textsearch}%`,
				}
			};
		}

		return Language.findAll(args);
	}

	/**
	 * Get language
	 * @param {number} id - id of language
	 * @param {string} slug - id of language
	 * @returns {Object} array of languages
	 */
	getLanguage(id, slug) {
		const where = {};

		if (id) {
			where.id = id;
		}

		if (slug) {
			where.slug = slug;
		}

		return Language.findOne({ where });
	}
}
