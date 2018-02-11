import _s from 'underscore.string';

// logic
import PermissionsService from './PermissionsService';

// models
import TextNode from '../../models/textNode';
import Work from '../../models/work';
import Language from '../../models/language';
import Version from '../../models/version';
import Exemplar from '../../models/exemplar';
import Translation from '../../models/translation';

// lib
import serializeUrn from '../../modules/cts/lib/serializeUrn';

const parseUrnToQuery = async (urn, language, workId) => {
	let textNode = null;
	let works = [];

	const query = {
		order: ['index'],
		limit: 30,
		where: {},
	};

	if (workId) {
		query.include = [{
			model: Work,
			where: {
				id: workId,
			},
		}];
	} else {
		const workUrn = serializeUrn({
			ctsNamespace: urn.ctsNamespace,
			textGroup: urn.textGroup,
			work: urn.work,
		});

		const workQuery = {
			where: {
				urn: workUrn,
			},
		};

		if (language) {
			workQuery.include = [{
				model: Language,
				where: {
					slug: language,
				},
			}];
		}

		const version = urn.version;
		delete urn.version;

		const exemplar = urn.exemplar;
		delete urn.exemplar;

		const translation = urn.translation;
		delete urn.translation;

		/**
		 * Interesting use case with CTS URNs and perhaps something to address in the future
		 * querying by verison, exemplar, and translation, but only in that order
		 */
		if (version) {
			const versionRecord = await Version.findOne({
				where: {
					urn: `${serializeUrn(urn)}.${version}`,
				}
			});
			if (versionRecord) {
				workQuery.where = {
					id: versionRecord.workId,
				};
			}

			if (exemplar) {
				const exemplarRecord = await Exemplar.findOne({
					where: {
						urn: `${serializeUrn(urn)}.${version}.${exemplar}`,
					}
				});
				if (exemplarRecord) {
					workQuery.where = {
						id: exemplarRecord.workId,
					};
				}

				if (translation) {
					const translationRecord = await Translation.findOne({
						where: {
							urn: `${serializeUrn(urn)}.${version}.${exemplar}.${translation}`,
						}
					});
					if (translationRecord) {
						workQuery.where = {
							id: translationRecord.workId,
						};
					}
				}
			}
		}

		// find a work via urn
		works = await Work.findAll(workQuery);
		const workIds = [];
		works.forEach((_work) => {
			workIds.push(_work.id);
		});
		if (works && works.length) {
			query.include = [{
				model: Work,
				where: {
					id: workIds,
				},
			}];
		}
	}


	// parse passage to range query
	if (urn.passage && urn.passage.length) {
		query.where.location = urn.passage[0];
		textNode = await TextNode.findOne(query);

		if (textNode) {
			query.where.index = {
				$gte: textNode.index,
			};

			if (urn.passage.length > 1) {
				query.where.location = urn.passage[1];
				const textNodeLast = await TextNode.findOne(query);

				if (textNodeLast) {
					query.where.index.$lt = textNodeLast.index;
				}

			} else {
				query.where.index.$lte = textNode.index;
			}

			delete query.where.location;

		} else {

			// when no textnode is found for location, return nothing for query
			return null;
		}
	}

	return query;
};


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
	 * @param {string} index
	 * @param {Object} urn
	 * @param {[number]} location
	 * @param {[number]} startsAtLocation
	 * @param {[number]} endsAtLocation
	 * @param {number} startsAtIndex
	 * @param {number} endsAtIndex
	 * @param {number} offset
	 * @param {number} workid
	 * @returns {Object[]} array of text nodes
	 */
	async textNodesGet(index, urn, language, location, startsAtLocation,
		endsAtLocation, startsAtIndex, offset, workId) {
		let textNode = null;
		let query = {
			order: ['index'],
			limit: 30,
			where: {},
			include: [],
		};

		if (workId) {
			query.include.push({
				model: Work,
				where: {
					id: parseInt(workId, 10),
				},
			});
		}

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

		if (startsAtIndex && endsAtIndex) {
			query.where.index = {
				$gte: startsAtIndex,
				$lt: endsAtIndex
			};
		}

		if (offset) {
			query.offset = offset;
		}

		if (startsAtLocation) {
			query.where.location = startsAtLocation;
			textNode = await TextNode.findOne(query);

			delete query.where.location;

			query.where.index = {
				$gte: textNode.index,
			};
		}

		if (urn) {
			query = await parseUrnToQuery(urn, language, workId);

			// TODO: better error handling for parsing errors
			// If error parsing URN to query, just return empty array
			if (!query) {
				return [];
			}
		}

		const textNodes = await TextNode.findAll(query);
		return textNodes;
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
		};

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
		};

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

	/**
	 * Get text node urn
	 */
	getTextNodeURN(parent) {
		let urn = '';
		const passageUrn = '';
		let workUrn = '';

		if (parent.dataValues && parent.work && parent.work.dataValues) {
			const location = parent.dataValues.location;

			const work = parent.work.dataValues;
			if (work) {
				workUrn = work.urn;
				urn = `${workUrn}:`;
			}

			urn = `${urn}${location.join('.')}`;
		}

		return urn;
	}

	/**
	 * Get text node words
	 */
	getTextNodeWords(parent) {
		const words = [];

		if (parent.dataValues) {
			const sanitizedText = _s(parent.dataValues.text).stripTags().trim();
			const _words = sanitizedText.split(' ');



			_words.forEach((word) => {
				words.push({
					word,
					parent,
				});
			});
		}


		return words;
	}

	/**
	 * Get word urn
	 */
	getWordURN(parent) {
		let urn = '';
		const passageUrn = '';
		let workUrn = '';

		if (parent.word && parent.parent) {
			const location = parent.parent.dataValues.location;

			const work = parent.parent.work.dataValues;
			if (work) {
				workUrn = work.urn;
				urn = `${workUrn}:`;
			}

			urn = `${urn}${location.join('.')}@${parent.word}`;
		}

		return urn;
	}
}
