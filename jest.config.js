// dotenv
const dotenvSetup = require('./src/dotenv');

dotenvSetup();

module.exports = {
	collectCoverageFrom: ['src/**/*.js']
};
