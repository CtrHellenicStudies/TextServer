import https from 'https';
import winston from 'winston';

const validateTokenOAuth2 = (accessToken, url) => new Promise((resolve, reject) => {

	https.get(`${url}?access_token=${accessToken}`, (res) => {
		const {
			statusCode
		} = res;

		winston.info('statusCode', statusCode)

		let error;
		if (statusCode !== 200) {
			error = new Error('Request Failed.\n' +
				`Status Code: ${statusCode}`);
		}

		if (error) {
			winston.error(error.message);
			// consume response data to free up memory
			res.resume();
			return;
		}

		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', (chunk) => {
			rawData += chunk;
		});
		res.on('end', () => {
			try {
				const parsedData = JSON.parse(rawData);
				resolve(parsedData);
			} catch (e) {
				winston.error(e.message);
			}
		});
	}).on('error', (e) => {
		winston.error(`Got error: ${e.message}`);
		reject(e);
	});
});

export default validateTokenOAuth2;
