// dotenv
const dotenvSetup = require('./src/dotenv');

dotenvSetup();

module.exports = {
	testEnvironment: 'node',
	collectCoverageFrom: ['src/**/*.js']
};
