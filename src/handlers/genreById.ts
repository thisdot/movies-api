import { APIGatewayProxyHandler } from 'aws-lambda';
import getAll from '../models/Genre/getAll';
import { GenreResponse } from '../types/apiResponse';

export const handler: APIGatewayProxyHandler = async (event) => {
	const notFoundResponse = {
		statusCode: 404,
		body: JSON.stringify({ message: 'Not Found' }),
	};
	const genreId = event?.pathParameters?.id;

	if (!genreId) {
		return notFoundResponse;
	}

	try {
		const response = await getAll({ query: { id: genreId } });

		if (!response.data?.length) {
			return notFoundResponse;
		}

		const { id, title, movies } = response.data[0];

		const result: GenreResponse = {
			id,
			title,
			totalMovies: movies?.length || 0,
		};

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
