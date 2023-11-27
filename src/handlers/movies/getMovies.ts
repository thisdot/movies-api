import sortBy from 'lodash/sortBy';
import { APIGatewayProxyHandler } from 'aws-lambda';
import getAllMovies from '@models/Movie/getAll';
import getAllGenres from '@models/Genre/getAll';
import { Movie } from '@customTypes/movie';
import { DEFAULT_CONTENTFUL_LIMIT } from '@utils/contentful';
import { CONTENTFUL_INCLUDE, ContentfulIncludeOptions } from '@customTypes/contentful';
import {
	mountSuccessResponse,
	notFoundResponse,
	serverErrorResponse,
} from '@utils/api/apiResponses';

type SearchFilters = {
	page?: number;
	limit?: number;
	genre?: string;
	search?: string;
	include?: ContentfulIncludeOptions;
};

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
			const response = await fetchMoviesByGenre({
				...searchFilters,
				include: CONTENTFUL_INCLUDE.movies,
			});

			if (!response) {
				return notFoundResponse;
			}

			return mountSuccessResponse({ data: response?.result, totalPages: response?.totalPages });
		}

		const entries = await getAllMovies(searchFilters);

		return mountSuccessResponse(entries);
	} catch (error: unknown) {
		console.error('Error fetching movies:', error);
		return serverErrorResponse;
	}
};

export async function fetchMoviesByGenre(searchFilters: SearchFilters) {
	if (!searchFilters.genre) {
		return null;
	}

	const moviesWithGenreEntries = await getAllGenres({
		include: searchFilters.include ?? CONTENTFUL_INCLUDE.noInclude,
		query: { title: searchFilters.genre },
	});

	if (!moviesWithGenreEntries.data.length) {
		return null;
	}

	let parsedMovies = moviesWithGenreEntries.data[0].movies as Movie[];

	// Filter by search query
	if (searchFilters.search) {
		const searchLower = searchFilters.search.toLowerCase();
		parsedMovies = parsedMovies.filter((movie) => movie.title?.toLowerCase().includes(searchLower));
	}

	// Sort and apply pagination
	const sortedMovies = sortBy(parsedMovies, 'title');
	const { page = 1, limit = DEFAULT_CONTENTFUL_LIMIT } = searchFilters;
	const paginatedMovies = sortedMovies.slice((page - 1) * limit, page * limit);

	return {
		result: paginatedMovies,
		totalPages: Math.ceil(sortedMovies.length / limit),
	};
}
