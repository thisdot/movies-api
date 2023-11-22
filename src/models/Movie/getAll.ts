import isNil from 'lodash/isNil';
import { DataWithPaginationResponse } from '../../types/apiResponse';
import { ContentfulIncludeOptions, MovieEntrySkeleton } from '../../types/contentful';
import { Movie } from '../../types/movie';
import { PaginationOptions } from '../../types/pagination';
import { DEFAULT_CONTENTFUL_LIMIT, cdaClient } from '../../utils/contentful';
import { parseMovie, parseMovieSummary } from './parseMovieData';

type QueryParamOptions = PaginationOptions & {
	search?: string;
	include?: ContentfulIncludeOptions;
	select?: string[];
};

export default async function getAll({
	limit = DEFAULT_CONTENTFUL_LIMIT,
	page = 1,
	search,
	include,
	select,
}: QueryParamOptions): Promise<DataWithPaginationResponse<Partial<Movie>>> {
	const skip = Math.max(0, (page - 1) * limit);

	const entries = await cdaClient.getEntries<MovieEntrySkeleton>({
		content_type: 'movie',
		limit: limit,
		skip: skip || 0,
		// @ts-ignore: Contentful type doesn't recognize Text input as acceptable order,
		// but SDK does process that successfully.
		order: ['fields.title'],
		'fields.title[match]': search,
		include,
		...(select?.length && { select }),
	});

	const shouldParseMovie = !isNil(include) && include > 0;
	const parseFunction = shouldParseMovie ? parseMovie : parseMovieSummary;
	const includeMoviesInGenres = shouldParseMovie && include > 1;

	const parsedMovies = entries.items.map((entry) => parseFunction(entry, includeMoviesInGenres));

	const totalPages = Math.ceil(entries.total / limit);

	return { data: parsedMovies, totalPages };
}
