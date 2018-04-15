import Sequelize from 'sequelize';
import axios from 'axios';
import queryString from 'query-string';
import winston from 'winston';
import xmlJs from 'xml-js';

import PermissionsService from '../../../../graphql/logic/PermissionsService';
import serializeLwCTSUrn from '../../../lightWeightCts/lib/serializeLwCTSUrn';


/**
 * Logic-layer service for dealing with LightWeight CTS
 */

export default class LightWeightCtsService extends PermissionsService {
	/**
	 * Get collection
	 * @param {Object} urn - urn
	 * @returns {Object} LightWeight CTS endpoint response
	 */
	async getApiResponse({ urn }) {
		// TODO lwcts urn doesn't use ctsNamespace, if we need it, we will need to make lwcts support it
		const serializedURN = encodeURIComponent(serializeLwCTSUrn(urn));
		const requestUrl = `${process.env.LWCTS_ENDPOINT}${serializedURN}`;
		const res = await axios.get(requestUrl);
		return res.data;
	}
}
