import PermissionsService from './PermissionsService';
import TextGroup from '../../models/textGroup';

/**
 * Logic-layer service for dealing with textGroups
 */
export default class TextGroupService extends PermissionsService {

	/**
	 * Count text groups
	 * @returns {number} count of text groups
	 */
	count() {
		return TextGroup.count();
	}

	/**
	 * Get a list of textGroups
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @param {number} collectionId
	 * @returns {Object[]} array of textGroups
	 */
	getTextGroups(textsearch, offset = 0, limit = 100, collectionId = null) {
		const args = {
			limit,
			offset,
			order: [
				['slug', 'ASC']
			],
		};

		if (textsearch) {
			if (!('where' in args)) {
				args.where = {};
			}
			args.where.title = {
				[Sequelize.Op.like]: `%${textsearch}%`,
			};
		}

		if (collectionId !== null) {
			if (!('where' in args)) {
				args.where = {};
			}

			args.where.collectionId = collectionId;
		}

		return TextGroup.findAll(args);
	}

	/**
	 * Get textGroup
	 * @param {number} id - id of textGroup
	 * @param {string} slug - slug of textGroup
	 * @param {string} urn - urn of the textgroup
	 * @param {string} collectionId - id of collection
	 * @returns {Object} returned textGroup
	 */
	getTextGroup(id, slug, urn, collectionId) {
		const where = {};

		if (id) {
			where.id = id;
		}

		if (slug) {
			where.slug = slug;
		}

		if (urn) {
			where.urn = urn;
		}

		return TextGroup.findOne({ where });
	}
}
