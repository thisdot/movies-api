import { parseMovie, parseMovieSummary } from './parseMovieData';
import { cdaClient, DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import { PaginationOptions } from '../../types/pagination';
import { DataWithPaginationResponse } from '../../types/apiResponse';
import { MovieSummary } from './type';
import { ContentfulIncludeOptions } from '../../types/contentful';
import isNil from 'lodash/isNil';

type QueryParamOptions = PaginationOptions & {
	search?: string;
	include?: ContentfulIncludeOptions;
};

export default async function getAll({
	limit = DEFAULT_CONTENTFUL_LIMIT,
	page = 1,
	search,
	include,
}: QueryParamOptions): Promise<DataWithPaginationResponse<MovieSummary>> {
	const skip = Math.max(0, (page - 1) * limit);

	const entries = await cdaClient.getEntries({
		content_type: 'movie',
		limit: limit,
		skip: skip || 0,
		order: ['fields.title'],
		'fields.title[match]': search,
		include,
	});

	const shouldParseMovie = !isNil(include) && include > 0;
	const parseFunction = shouldParseMovie ? parseMovie : parseMovieSummary;
	const includeMoviesInGenres = shouldParseMovie && include > 1;

	const parsedMovies = entries.items.map((entry) => parseFunction(entry, includeMoviesInGenres));

	const totalPages = Math.ceil(entries.total / limit);

	return { data: parsedMovies, totalPages };
}
