import cors from 'cors';

import DataLoader from 'dataloader';



export default function corsSetup(app) {

	const whitelist = [];

	if (process.env.NODE_ENV === 'development') {
		whitelist.push(process.env.CLIENT_SERVER);
	}

	// Check if project is white listed or in a database
	async function corsOptionsDelegate(req, callback) {
		const corsOptions = {
			origin: false,
			credentials: true,
		};

		const hostname = req.hostname;
		let project;

		corsOptions.origin = true;

		callback(null, corsOptions);
	}

	// CORS:
	app.use(cors(corsOptionsDelegate));
}
