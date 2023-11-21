import { APIGatewayProxyHandler } from 'aws-lambda';
import { notFoundResponse, serverErrorResponse } from '../../utils/api/apiResponses';
import getMovieById from '../../models/Movie/getById';
import { CONTENTFUL_INCLUDE } from '../../types/contentful';
import { isCustomContentfulError } from '../../utils/api/utils';

export const handler: APIGatewayProxyHandler = async (event) => {
	const movieId = event?.pathParameters?.id;

	try {
		const movie = await getMovieById(movieId || '', {
			include: CONTENTFUL_INCLUDE.genres,
		});

		return {
			statusCode: 200,
			body: JSON.stringify(movie),
		};
	} catch (error: unknown) {
		console.error('Error fetching movies:', error);

		// Check if error is of type CustomContentfulError
		if (isCustomContentfulError(error)) {
			// Now it's safe to assume error is of type CustomContentfulError
			if (error.sys?.id === 'NotFound') {
				return notFoundResponse;
			}
		}

		return serverErrorResponse;
	}
};
