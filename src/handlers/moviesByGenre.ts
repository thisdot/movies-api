import { APIGatewayProxyHandler } from 'aws-lambda';
import getAll from '../models/Genre/getAll';
import { cdaClient, CONTENTFUL_LIMIT } from '../utils/contentful';

export type HealthCheckResult = {
	contentful: boolean;
};

export const handler: APIGatewayProxyHandler = async (event) => {
	let page = 1;
	if (event.queryStringParameters && event.queryStringParameters.page) {
		const parsedPage = parseInt(event.queryStringParameters.page, 10);
		if (!isNaN(parsedPage) && parsedPage > 0) {
			page = parsedPage;
		}
	}

	const limit = CONTENTFUL_LIMIT;
	const skip = (page - 1) * limit;

	try {
		const genres = await getAll({ limit, skip });

		return {
			statusCode: 200,
			body: JSON.stringify(genres),
		};
	} catch (err) {
		console.error(err);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal Server Error' }),
		};
	}
};
