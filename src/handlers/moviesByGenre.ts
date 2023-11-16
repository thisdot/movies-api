import { APIGatewayProxyHandler } from 'aws-lambda';
import getAll from '../models/Genre/getAll';

export const handler: APIGatewayProxyHandler = async (event) => {
	let page = 1;
	if (event.queryStringParameters && event.queryStringParameters.page) {
		const parsedPage = parseInt(event.queryStringParameters.page, 10);
		if (!isNaN(parsedPage) && parsedPage > 0) {
			page = parsedPage;
		}
	}

	try {
		const result = await getAll({ page });

		return {
			statusCode: 200,
			body: JSON.stringify(result),
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal Server Error' }),
		};
	}
};
