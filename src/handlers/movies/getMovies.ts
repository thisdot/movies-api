import sortBy from 'lodash/sortBy';
import getAllMovies from '../../models/Movie/getAll';
import { APIGatewayProxyHandler } from 'aws-lambda';
import getAllGenres from '../../models/Genre/getAll';
import { MovieModel } from '../../models/Movie/type';
import { DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import { CONTENTFUL_INCLUDE } from '../../types/contentful';
import { serverErrorResponse } from '../../utils/api/apiResponses';

export const handler: APIGatewayProxyHandler = async (event) => {
	try {
		const searchFilters: {
			page?: number;
			limit?: number;
			genre?: string;
			search?: string;
		} = {};

		const { page, limit, genre, search } = event?.queryStringParameters || {};

		if (page) {
			const parsedPage = parseInt(page, 10);
			if (!isNaN(parsedPage) && parsedPage > 0) {
				searchFilters.page = parsedPage;
			}
		}

		if (limit) {
			const parsedLimit = parseInt(limit, 10);
			if (!isNaN(parsedLimit) && parsedLimit > 0) {
				searchFilters.limit = parsedLimit;
			}
		}

		if (genre) {
			searchFilters.genre = genre;
		}

		if (search) {
			searchFilters.search = search;
		}

		if (searchFilters.genre) {
			// 	we need to use the other getAll function because we need to filter by genre and Contentful doesn't support filtering by reference fields many to many
			const moviesWithGenreEntries = await getAllGenres({
				include: CONTENTFUL_INCLUDE.moviesWithGenre,
				query: {
					title: searchFilters.genre,
				},
			});

			let parsedMovies: MovieModel[] = moviesWithGenreEntries.data[0].movies as MovieModel[];

			// filter by search if received from call
			if (searchFilters.search) {
				parsedMovies = (moviesWithGenreEntries.data[0].movies as MovieModel[]).filter((movie) =>
					movie.title?.toLowerCase().includes(searchFilters.search?.toLowerCase() || '')
				);
			}

			// sort for output and prepare pagination
			const sortedMovies = sortBy(parsedMovies, 'title');

			// apply pagination
			const { page = 1, limit = DEFAULT_CONTENTFUL_LIMIT } = searchFilters;

			const result = sortedMovies.slice((page - 1) * limit, page * limit);

			return {
				statusCode: 200,
				body: JSON.stringify({
					data: result,
					totalPages: Math.ceil(sortedMovies.length / limit),
				}),
			};
		}

		const entries = await getAllMovies(searchFilters);

		return {
			statusCode: 200,
			body: JSON.stringify(entries),
		};
	} catch (error: unknown) {
		console.error('Error fetching movies:', error);
		if (error instanceof Error) {
			return {
				statusCode: 500,
				body: JSON.stringify({
					message: error.message,
				}),
			};
		} else {
			return serverErrorResponse;
		}
	}
};
