import Sequelize from 'sequelize';
import axios from 'axios';
import queryString from 'query-string';
import winston from 'winston';
import xmlJs from 'xml-js';

import PermissionsService from '../../../../graphql/logic/PermissionsService';
import serializeUrn from '../../../cts/lib/serializeUrn';


/**
 * Logic-layer service for dealing with Perseus CTS
 */

export default class PerseusCtsService extends PermissionsService {
	/**
	 * Get collection
	 * @param {string} request - request action for cts endpoint
	 * @param {Object} urn - urn
	 * @param {number} level - level requested for urn
	 * @returns {Object} Perseus CTS endpoint response
	 */
	async getApiResponse({ request, urn, level }) {
		const params = {request};

		if (level) {
			params.level = level;
		}

		const stringifiedParams = queryString.stringify(params);
		const requestUrl = `${process.env.CTS_ENDPOINT}?${stringifiedParams}&urn=${serializeUrn(urn)}`;
		const res = await axios.get(requestUrl);
		const data = JSON.parse(xmlJs.xml2json(res.data, {compact: true, spaces: 4}));
		return data;
	}
}
