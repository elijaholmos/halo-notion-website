import fetch from 'node-fetch';
import { allowCors } from './_allowCors';
import { logger } from './_logger';

const tokenExchange = async (req, res) => {
	logger.info('beginning of tokenExchange');
	try {
		logger.info('incoming request body');
		logger.info(req.body);
		let { code, redirect_uri } = req.body;
		if (!code || !redirect_uri) return res.status(400).end();
		redirect_uri = decodeURIComponent(redirect_uri);
		const result = await fetch('https://api.notion.com/v1/oauth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${Buffer.from(
					`${process.env[`${req.env}_client_id`]}:${process.env[`${req.env}_client_secret`]}`
				).toString('base64')}`,
			},
			body: {
				grant_type: 'authorization_code',
				code,
				redirect_uri,
			},
		});

		res.status(result.status).json(await result.json().catch(() => null));
	} catch (e) {
		logger.error(e);
		return res.status(500).json(e);
	}
};

export default allowCors(tokenExchange);
