import { APIGatewayProxyHandler } from 'aws-lambda';
import getGenreById from '../../models/Genre/getById';
import { GenreResponse } from '../../types/apiResponse';
import { notFoundResponse, serverErrorResponse } from '../../utils/api/apiResponses';

export const handler: APIGatewayProxyHandler = async (event) => {
	const genreId = event?.pathParameters?.id;

	if (!genreId) {
		return notFoundResponse;
	}

	try {
		const response = await getGenreById(genreId);

		if (!response) {
			return notFoundResponse;
		}

		const { id, title, movies } = response;

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
		return serverErrorResponse;
	}
};
