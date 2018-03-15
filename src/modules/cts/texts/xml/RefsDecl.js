import RefsDecl from '../../../../models/refsDecl';

/** Class representing a reference declaration of a work item */
class _RefsDecl {

	/**
	 * Create a new reference declaration
	 */
	constructor({ label, description, matchPattern, replacementPattern, structureIndex, urn }) {
		this.label = label;
		this.description = description;
		this.matchPattern = matchPattern;
		this.replacementPattern = replacementPattern;
		this.structureIndex = structureIndex;
		this.urn = urn;
	}

	/**
	 * Save reference declaration to db
	 */
	async save(work) {
		const refsDecl = await RefsDecl.create({
			label: this.label,
			description: this.description,
			match_pattern: this.matchPattern,
			replacement_pattern: this.replacementPattern,
			structure_index: this.structureIndex,
			urn: this.urn,
		});

		await refsDecl.setWork(work);
		await work.addRefsdecl(refsDecl);
	}
}

export default _RefsDecl;
