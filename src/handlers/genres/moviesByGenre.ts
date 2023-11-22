import { APIGatewayProxyHandler } from 'aws-lambda';
import getAllGenre from '../../models/Genre/getAll';
import { serverErrorResponse } from '../../utils/api/apiResponses';
import { DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';

export const handler: APIGatewayProxyHandler = async (event) => {
	const { page: queryStringPage = '', limit: queryStringLimit = '' } =
		event?.queryStringParameters || {};

	let page = 1;
	const parsedPage = parseInt(queryStringPage, 10);
	if (!isNaN(parsedPage) && parsedPage > 0) {
		page = parsedPage;
	}
	let limit = DEFAULT_CONTENTFUL_LIMIT;
	const parsedLimit = parseInt(queryStringLimit, 10);
	if (!isNaN(parsedLimit) && parsedLimit > 0) {
		limit = parsedLimit;
	}

	try {
		const result = await getAllGenre({ page, limit });

		return {
			statusCode: 200,
			body: JSON.stringify(result),
		};
	} catch (err) {
		return serverErrorResponse;
	}
};
