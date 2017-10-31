import PermissionsService from './PermissionsService';
import TextNodes from '../../models/textNode';


/**
 * Logic-layer service for dealing with text nodes
 */
export default class TextNodesService extends PermissionsService {

	/**
	 * Create a text node
	 * @param {Object} textNode - candidate text node to create
	 * @returns {string} id of newly created text node
	 */
	textNodeCreate(textNode) {
		if (this.userIsAdmin) {
			return TextNodes.insert(textNode);
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a text node
	 * @param {string} textNodeId - id of text node
	 * @returns {boolean} result from mongo orm remove
	 */
	textNodeRemove(id) {
		if (this.userIsAdmin) {
			const removeId = new Mongo.ObjectID(id);
			return TextNodes.remove({_id: removeId});
		}
		return new Error('Not authorized');
	}


	/**
	 * Get text nodes
	 * @param {string} id - id of text node
	 * @param {string} tenantId - id of current tenant
	 * @param {number} limit - limit for mongo
	 * @param {number} skip - skip for mongo
	 * @param {string} workSlug - slug of work
	 * @param {number} subworkN - number of subwork
	 * @param {string} editionSlug - slug of edition
	 * @param {number} lineFrom - number of line that textnodes should be greater
	 *   than or equal to
	 * @param {number} lineTo - number of line that textnodes should be less than
	 *   or equal to
	 * @returns {Object[]} array of text nodes
	 */
	textNodesGet(id, tenantId, limit, skip, workSlug, subworkN, editionSlug, lineFrom, lineTo) {
		if (this.userIsAdmin) {
			const args = {};
			const options = {
				sort: {
					'work.slug': 1,
					'text.n': 1,
				},
			};

			if (_id) {
				args._id = new Mongo.ObjectID(_id);
			}
			if (editionSlug) {
				args['text.edition.slug'] = { $regex: slugify(editionSlug), $options: 'i'};
			}
			if (lineFrom) {
				args['text.n'] = { $gte: lineFrom };
			}
			if (lineTo) {
				args['text.n'] = { $lte: lineTo };
			}

			// TODO: reinstate search for line letter and text
			// if (lineLetter) {
			// 	args['text.letter'] = lineLetter;
			// }
			// if (text) {
			// 	args['text.text'] = { $regex: text, $options: 'i'};
			// }

			if (workSlug) {
				args['work.slug'] = slugify(workSlug);
			}
			if (subworkN) {
				args['subwork.n'] = parseInt(subworkN, 10);
			}

			if (limit) {
				options.limit = limit;
			} else {
				options.limit = 100;
			}

			if (skip) {
				options.skip = skip;
			} else {
				options.skip = 0;
			}

			return TextNodes.find(args, options).fetch();
		}
		return new Error('Not authorized');
	}

	/**
	 * Get paginated text node location following specified location based on offset
	 * @param {number} work - id of textnode work
	 * @param {number[]} location - location array to offset from
	 * @param {number} offset - the offset to iterate
	 * @returns {number[]} location array
	 */
	textLocationNext(work, location, offset) {
		const query = {
			where: {
				workid,
			},
			order: ['index'],
		}

		if (location) {
			query.where.location = location;
		}

		return TextNode.findOne(query).then((node) => {
			delete query.where.location;

			query.where.index = {
				$gte: node.index
			};

			query.limit = offset;

			return TextNode.findAll(query).then((nodes) => {
				if (!nodes || !nodes.length || !node.length === offset) {
					return [];
				}

				return nodes[nodes.length - 1].location;
			});
		});
	}

	/**
	 * Get paginated text node location following specified location based on offset
	 * @param {number} work - id of textnode work
	 * @param {number[]} location - location array to offset from
	 * @param {number} offset - the offset to iterate
	 * @returns {number[]} location array
	 */
	textLocationPrev(work, location, offset) {
		const query = {
			where: {
				workid,
			},
			order: ['index'],
		}

		if (location) {
			query.where.location = location;
		}

		return TextNode.findOne(query).then((node) => {
			delete query.where.location;

			query.where.index = {
				$lt: node.index,
			};
			query.order = [['index', 'DESC']];
			query.limit = offset;

			return TextNode.findAll(query).then((nodes) => {
				if (!nodes || !nodes.length) {
					return [];
				}

				return nodes[nodes.length - 1].location;
			});
		});
	}
}
