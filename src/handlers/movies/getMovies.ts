import { getAll as getAllMovies } from '../../models/Movie';
import { APIGatewayProxyHandler } from 'aws-lambda';
import getAll from '../../models/Genre/getAll';

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const queryParams: {
			page?: number;
			limit?: number;
			genre?: string;
			search?: string;
			ids?: string[];
		} = {};

		const { queryStringParameters } = event;

		if (queryStringParameters) {
			const { page, limit, genre, search } = queryStringParameters;

			if (page) {
				const parsedPage = parseInt(page, 10);
				if (!isNaN(parsedPage) && parsedPage > 0) {
					queryParams.page = parsedPage;
				}
			}

			if (limit) {
				const parsedLimit = parseInt(limit, 10);
				if (!isNaN(parsedLimit) && parsedLimit > 0) {
					queryParams.limit = parsedLimit;
				}
			}

			if (genre) {
				queryParams.genre = genre;
			}

			if (search) {
				queryParams.search = search;
			}
		}

		if (queryParams.genre) {
			// 	we need to use the other getAll function because we need to filter by genre and Contentful doesn't support filtering by reference fields many to many
			const moviesWithGenreEntries = await getAll({
				include: 1,
				query: {
					title: queryParams.genre,
				},
			});

			const moviesIds = moviesWithGenreEntries.data[0].movies.map((movie) => movie.id);

			queryParams.ids = moviesIds;
		}

		const entries = await getAllMovies(queryParams);

		return {
			statusCode: 200,
			body: JSON.stringify(entries),
		};
	} catch (error: unknown) {
		console.error('Error fetching movies:', error);
		if (error instanceof Error) {
			return {
				statusCode: 400,
				body: JSON.stringify({
					message: error.message,
				}),
			};
		} else {
			return {
				statusCode: 500,
				body: 'Internal Server Error',
			};
		}
	}
};
