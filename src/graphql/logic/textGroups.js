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
	 * @returns {Object[]} array of textGroups
	 */
	getTextGroups(textsearch, offset = 0, limit = 100) {
		const args = {};

		if (textsearch) {
			args.where = {
				title: {
					[Sequelize.Op.like]: `%${textsearch}%`,
				}
			};
		}

		return TextGroup.findAll(args, {
			limit,
			offset,
			order: [
				['slug', 'ASC']
			]
		});
	}

	/**
	 * Get textGroup
	 * @param {number} id - id of textGroup
	 * @param {string} slug - id of textGroup
	 * @returns {Object} array of textGroups
	 */
	getTextGroup(id, slug, urn) {
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

		return TextGroup.findOne(where);
	}
}
