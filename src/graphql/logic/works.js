import Sequelize from 'sequelize';

// logic
import PermissionsService from './PermissionsService';

// models
import Work from '../../models/work';
import Language from '../../models/language';
import TextGroup from '../../models/textGroup';
import Version from '../../models/version';

// lib
import serializeUrn from '../../modules/cts/lib/serializeUrn';

/**
 * Logic-layer service for dealing with works
 */
export default class WorkService extends PermissionsService {
	/**
	 * Create a work
	 * @param {Object} work - candidate work to create
	 * @returns {Object} newly created work
	 */
	insert(work) {
		if (this.userIsAdmin) {
			const newWork = work;
			newWork.subworks = this.rewriteSubworks(work.subworks);

			const workId = Work.insert({...newWork});
			return Work.findOne(workId);
		}
		return new Error('Not authorized');
	}

	/**
	 * Update a work
	 * @param {string} _id - id of work
	 * @param {Object} work - work to update
	 * @returns {boolean} result from mongo orm update
	 */
	update(_id, work) {
		if (this.userIsAdmin) {
			const newWork = work;
			newWork.subworks = this.rewriteSubworks(work.subworks);

			return Work.update(_id, {$set: newWork});
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a work
	 * @param {string} _id - id of work
	 * @returns {boolean} result from mongo orm remove
	 */
	remove(_id) {
		if (this.userIsAdmin) {
			return Work.remove({ _id });
		}
		return new Error('Not authorized');
	}

	/**
	 * Get works
	 * @param {string} textsearch
	 * @param {string} urn
	 * @param {string} language
	 * @param {number} offset
	 * @param {number} limit
	 * @returns {Object[]} array of works
	 */
	async getWorks(textsearch, urn, language, offset = 0, limit = 100, textGroupId = null) {
		const args = {
			where: {},
			limit,
			offset,
			order: [
				['slug', 'ASC']
			],
			include: [],
		};

		if (textsearch) {
			args.where.english_title = {
				[Sequelize.Op.like]: `%${textsearch}%`,
			};
		}

		if (language) {
			const languageRecord = await Language.findOne({
				where: {
					slug: language,
				},
			});
			args.include.push({
				model: Language,
				where: {
					id: languageRecord.id,
				},
			});
		}

		if (textGroupId !== null) {
			args.include.push({
				model: TextGroup,
				where: {
					id: textGroupId,
				},
			});
		}

		if (urn) {
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
			args.where.urn = serializeUrn(urn);
			if (version) {

				const versionRecord = await Version.findOne({
					where: {
						urn: `${serializeUrn(urn)}.${version}`,
					}
				});

				if (versionRecord) {
					args.where = {
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
						args.where = {
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
							args.where = {
								id: translationRecord.workId,
							};
						}
					}
				}
			}
		}

		const works = await Work.findAll(args);
		return works;
	}

	/**
	 * Get work
	 * @param {number} id - id of work
	 * @param {string} slug - slug of work
	 * @returns {Object} work object record
	 */
	getWork(id, slug) {
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

		return Work.findOne({ where });
	}

	/**
	 * Count works
	 * @returns {number} count of works
	 */
	count() {
		return Work.count();
	}
}
