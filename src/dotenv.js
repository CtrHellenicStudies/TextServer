const dotenv = require('dotenv');

const dotenvSetup = () => {
	if (process.env.NODE_ENV === 'production') {
		dotenv.config({ path: '.env.production.local' });
		dotenv.config({ path: '.env.production' });
	} else if (process.env.NODE_ENV === 'test') {
		dotenv.config({ path: '.env.test.local' });
		dotenv.config({ path: '.env.test' });
	} else {
		dotenv.config({ path: '.env.development.local' });
		dotenv.config({ path: '.env.development' });
	}
	dotenv.config({ path: '.env.local' });
	dotenv.config({ path: '.env' });
};

module.exports = dotenvSetup;
