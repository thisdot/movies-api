import { APIGatewayProxyHandler } from 'aws-lambda';
import getGenreById from '@models/Genre/getById';
import { GenreResponse } from '@customTypes/apiResponse';
import {
	mountSuccessResponse,
	notFoundResponse,
	serverErrorResponse,
} from '@utils/api/apiResponses';
import { withAuthorization } from '@utils/api/withAuthorization';

export const handler: APIGatewayProxyHandler = withAuthorization(async (event) => {
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

		return mountSuccessResponse(result);
	} catch (err) {
		return serverErrorResponse;
	}
});
