
import PermissionsService from './PermissionsService';
import TextGroup from '../../models/textGroup';
import serializeUrn from '../../modules/cts/lib/serializeUrn';


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
	 * @param {string} urn
	 * @param {number} offset
	 * @param {number} limit
	 * @param {number} collectionId
	 * @returns {Object[]} array of textGroups
	 */
	getTextGroups(textsearch, urn, offset = 0, limit = 100, collectionId = null) {
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

		if (urn) {
			args.where.urn = serializeUrn(urn);
		}

		if (collectionId !== null) {
			args.where.collectionId = collectionId;
		}

		return TextGroup.findAll(args);
	}

	/**
	 * Get textGroup
	 * @param {number} id - id of textGroup
	 * @param {string} slug - slug of textGroup
	 * @param {string} collectionId - id of collection
	 * @returns {Object} returned textGroup
	 */
	getTextGroup(id, slug, collectionId) {
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

		return TextGroup.findOne({ where });
	}
}
