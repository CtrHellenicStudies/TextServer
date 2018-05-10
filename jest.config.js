// dotenv
const dotenvSetup = require('./src/dotenv');

dotenvSetup();

module.exports = {
	testEnvironment: 'node',
	collectCoverageFrom: [
		'src/**/*.js', 
		'!src/migrations/*' // migrations are sort of being tested in CI
	]
};
