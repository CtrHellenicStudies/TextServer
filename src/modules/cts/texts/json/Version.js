import Version from '../../../../models/version';

/** Class representing a version of a work */
class _Version {

	/**
	 * Create a new version
	 */
	constructor({ title, urn }) {
		this.title = title;
		this.urn = urn;
		this._id = null;
		this.work = null;
	}

	/**
	 * Save version to db
	 */
	async save(work) {
		const version = await Version.create({
			title: this.title,
			urn: this.urn,
		});

		await version.setWork(work);
		await work.addVersion(version);
	}

}

export default _Version;
