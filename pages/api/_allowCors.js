import { logger } from './_logger';

const origins = {
	prod: [
		'chrome-extension://ldakjkgbikbopkahholdoojdbhgeepge',	//chrome
		'chrome-extension://nfkhnmlomhplckaeelfcpdjplgnpjbml',	//edge
		'moz-extension://a3a6c3eb-d225-421e-964d-97e807b157a5', //firefox 2.0.0
	],
	dev: [
		'chrome-extension://ojlbjbemdpmhehlgpanomkemdfopdfim',
		'chrome-extension://fmiflnochmeioohllbkndhfejffjlnce',
		'chrome-extension://pcdgecknpjomjbflofkmhikocgcejjnl',	//edge
		'moz-extension://8ac2f73c-1055-4f78-ac68-86bfb0ce14c4', //firefox
	],
};

export const allowCors = (fn) => async (req, res) => {
	logger.info('beginning of allowCors');
	if (!['POST', 'OPTIONS'].includes(req.method.toUpperCase()))
		return res.status(404).end();
	//check valid origin
	if (!req?.headers?.origin) return res.status(404).end();
	const { origin } = req.headers;
	for (const [env, valid_origins] of Object.entries(origins)) {
		if (!valid_origins.includes(origin)) continue;
		req.env = env;
	}
	
	if(origin.startsWith('chrome-extension://')) req.env = 'dev';

	if (!req.env) return res.status(404).end();

	res.setHeader('Access-Control-Allow-Credentials', true);
	//res.setHeader('Access-Control-Allow-Origin', '*');
	// another common pattern
	res.setHeader('Access-Control-Allow-Origin', origin);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET,OPTIONS,PATCH,DELETE,POST,PUT'
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	);
	if (req.method === 'OPTIONS') return res.status(200).end();

	logger.info('end of allowCors');
	logger.info(JSON.stringify(req.body));
	return await fn(req, res);
};
