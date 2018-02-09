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
	getTranslations(textsearch, offset = 0, limit = 100, translationId = null) {
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

		if (translationId) {
			args.where.translationId = translationId;
		}

		return Translation.findAll(args);
	}

	/**
	 * Get translation
	 * @param {number} id - id of translation
	 * @param {string} slug - id of translation
	 * @returns {Object} array of translations
	 */
	getTranslation(id, slug, translationId) {
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

		if (translationId) {
			where.translationId = translationId;
		}

		return Translation.findOne({ where });
	}

	/**
	 * Create a translation
	 * @param {Object} translation - candidate translation to create
	 * @returns {Object} newly created translation
	 */
	insert(translation) {
		if (this.userIsAdmin) {
			const translationId = Work.insert({ ...translation });
			return Translation.findOne(translationId);
		}
		return new Error('Not authorized');
	}

	update(_id, translation) {
		if (this.userIsAdmin) {
			return Translation.update(_id, { $set: translation });
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a translation
	 * @param {string} _id - id of translation
	 * @returns {boolean} result from mongo orm remove
	 */
	remove(_id) {
		if (this.userIsAdmin) {
			return Translation.remove({ _id });
		}
		return new Error('Not authorized');
	}




}
