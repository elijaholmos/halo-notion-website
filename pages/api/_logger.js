import pino from 'pino';
import { logflarePinoVercel } from 'pino-logflare';
const { stream, send } = logflarePinoVercel({
	apiKey: process.env.logflare_api_key,
	sourceToken: process.env.logflare_source_token,
});

export const logger = pino(
	{
		browser: {
			transmit: {
				level: 'info',
				send,
			},
		},
		level: 'debug',
	},
	stream
);
