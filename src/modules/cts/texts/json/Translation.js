import Translation from '../../../../models/translation';

/** Class representing a translation of a work */
class _Translation {

	/**
	 * Create a new translation
	 */
	constructor({ title, urn }) {
		this.title = title;
		this.urn = urn;
		this._id = null;
		this.work = null;
	}

	/**
	 * Save translation to db
	 */
	async save(work) {
		const translation = await Translation.create({
			title: this.title,
			urn: this.urn,
		});

		await translation.setWork(work);
		await work.addTranslation(translation);
	}

}

export default _Translation;
