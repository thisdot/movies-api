import { APIGatewayProxyHandler } from 'aws-lambda';
import {
	mountSuccessResponse,
	notFoundResponse,
	serverErrorResponse,
} from '@utils/api/apiResponses';
import getMovieById from '@models/Movie/getById';
import { CONTENTFUL_INCLUDE } from '@customTypes/contentful';
import { isCustomContentfulError } from '@utils/api/utils';

export const handler: APIGatewayProxyHandler = async (event) => {
	const movieId = event?.pathParameters?.id;

	if (!movieId) {
		return notFoundResponse;
	}

	try {
		const movie = await getMovieById(movieId, {
			include: CONTENTFUL_INCLUDE.genres,
		});

		if (!movie) {
			return notFoundResponse;
		}

		return mountSuccessResponse(movie);
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
