import fetch from 'node-fetch';
import { allowCors } from './_allowCors';
import { logger } from './_logger';

const tokenExchange = async (req, res) => {
	logger.info('beginning of proxy');
	try {
		logger.info(`target url: ${req.query.url}`);
		const { url } = req.query;
		if (!url) return res.status(400).end();
		logger.info('incoming request body');
		logger.info(req.body);
		const result = await fetch(decodeURIComponent(url), {
			...req.body,
		});

		res.status(result.status).json(await result.json().catch(() => null));
	} catch (e) {
		logger.error(e);
		return res.status(500).json(e);
	}
};

export default allowCors(tokenExchange);
