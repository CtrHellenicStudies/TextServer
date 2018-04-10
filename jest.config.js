// dotenv
const dotenvSetup = require('./src/dotenv');

dotenvSetup();

module.exports = {
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.js']
};
