import PermissionsService from './PermissionsService';
import TextNode from '../../models/textNode';
import Work from '../../models/work';


/**
 * Logic-layer service for dealing with text nodes
 */
export default class TextNodeService extends PermissionsService {

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
	 *	 than or equal to
	 * @param {number} lineTo - number of line that textnodes should be less than
	 *	 or equal to
	 * @returns {Object[]} array of text nodes
	 */
	textNodesGet( workId, location, offset, index, startsAtLocation, startsAtIndex ) {
		const query = {
			include: [{
				model: Work,
				where: {
					id: parseInt(workId),
				},
			}],
			order: ['index'],
			limit: 30,
		};

		if (location) {
			query.where.location = location;
		}

		if (index) {
			query.where.index = index;
		}

		if (startsAtIndex) {
			query.where.index = {
				$gte: startsAtIndex,
			};
		}

		if (offset) {
			query.offset = offset;
		}

		console.log(query);

		if (startsAtLocation) {
			query.where.location = startsAtLocation;
			return TextNode.findOne(query).then((node) => {

				if (!node) {
					// TODO: Handle error

					return null;
				}

				delete query.where.location;

				query.where.index = {
					$gte: node.index,
				};

				return TextNode.findAll(query);
			});
		}

		return TextNode.findAll(query);
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
