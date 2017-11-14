import PermissionsService from './PermissionsService';
import Author from '../../models/author';

/**
 * Logic-layer service for dealing with authors
 */

export default class AuthorService extends PermissionsService {
	/**
	 * Count authors
	 * @returns {number} count of authors
	 */
	count() {
		return Author.count();
	}

	/**
	 * Get a list of authors
	 * @param {string} textsearch
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of authors
	 */
	getAuthors(textsearch, offset = 0, limit = 100) {
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

		return Author.findAll(args);
	}

	/**
	 * Get author
	 * @param {number} id - id of author
	 * @param {string} slug - id of author
	 * @returns {Object} array of authors
	 */
	getAuthor(id, slug, urn) {
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

		return Author.findOne(where);
	}
}
