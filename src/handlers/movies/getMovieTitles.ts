import { APIGatewayProxyHandler } from 'aws-lambda';
import getAllMovies from '../../models/Movie/getAll';
import { serverErrorResponse } from '../../utils/api/apiResponses';
import { DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';

export const handler: APIGatewayProxyHandler = async (event) => {
	let page = 1;
	if (event.queryStringParameters && event.queryStringParameters.page) {
		const parsedPage = parseInt(event.queryStringParameters.page, 10);
		if (!isNaN(parsedPage) && parsedPage > 0) {
			page = parsedPage;
		}
	}

	let limit = DEFAULT_CONTENTFUL_LIMIT;
	if (event.queryStringParameters && event.queryStringParameters.limit) {
		const parsedLimit = parseInt(event.queryStringParameters.limit, 10);
		if (!isNaN(parsedLimit) && parsedLimit > 0) {
			limit = parsedLimit;
		}
	}

	try {
		const result = await getAllMovies({ page, limit, select: ['sys.id', 'fields.title'] });

		return {
			statusCode: 200,
			body: JSON.stringify(result),
		};
	} catch (err) {
		return serverErrorResponse;
	}
};
