import winston from 'winston';
import _s from 'underscore.string';

import ctsNamespace from '../../lib/ctsNamespace';
import Version from '../../../../models/Version';

/** Class representing a version of a work */
class _Version {

	/**
	 * Create a new version
	 */
	constructor({ urn, _versionXML }) {
		this._versionXML = _versionXML;
		this.title;
		this.description;
		this.urn = urn;

		this._parseMetadataFromXml();
	}

	/**
	 * Parse metadata about this work from the input xml file
	 */
	_parseMetadataFromXml() {
		const labelElems = this._versionXML.getElementsByTagNameNS(ctsNamespace, 'label');
		if (labelElems && labelElems.length) {
			this.title = labelElems[0].firstChild.nodeValue;
		}
		const descriptionElems = this._versionXML.getElementsByTagNameNS(ctsNamespace, 'description');
		if (descriptionElems && descriptionElems.length) {
			this.title = descriptionElems[0].firstChild.nodeValue;
		}
	}

	/**
	 * Save version to db
	 */
	async save(work) {
		const version = await Version.create({
			title: _s.prune(this.title, 250),
			description: this.description,
			urn: this.urn,
		});

		await version.setWork(work);
		await work.addVersion(version);
	}
}

export default _Version;
