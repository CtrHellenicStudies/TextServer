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
			args.where.id = translationId;
		}

		return Translation.findAll(args);
	}

	/**
	 * Get translation
	 * @param {number} id - id of translation
	 * @param {string} slug - slug of translation
	 * @param {string} workId - id of work for translation
	 * @returns {Object} array of translations
	 */
	getTranslation(id, slug, workId) {
		const where = {};

		/*
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

		return Translation.findOne({ where });
	}

	/**
	 * Create a translation
	 * @param {Object} translation - candidate translation to create
	 * @returns {Object} newly created translation
	 */
	translationInsert(translation) {
		if (this.userIsAdmin) {
			const translationId = Translation.insert({ ...translation });
			return Translation.findOne(translationId);
		}
		return new Error('Not authorized');
	}

	/**
	 * update translation
	 * @param {Object} id - id of the translation to be modified
	 * @param {Object} translation - translation input type for updating
	 * @returns {Object} modified translation
	 */
	async translationUpdate(id, translation) {

		if (this.userIsAdmin) {

			const translationInstance = await Translation.findById(id);
			translationInstance.updateAttributes(translation);
			return translationInstance.save();

		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a translation
	 * @param {string} _id - id of translation
	 * @returns {boolean} result from mongo orm remove
	 */
	translationRemove(id) {
		if (this.userIsAdmin) {
			return Translation.remove({ id });
		}
		return new Error('Not authorized');
	}

}
