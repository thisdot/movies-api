import { DataWithPaginationResponse } from '../../types/apiResponse';
import { MovieEntrySkeleton } from '../../types/contentful';
import { PaginationOptions } from '../../types/pagination';
import { cdaClient, DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import { parseMovieSummary } from './parseMovieData';
import { MovieSummary } from '../../types/movie';

type QueryParamOptions = PaginationOptions & {
	genre?: string;
	search?: string;
	select?: string[];
};

export default async function getAll({
	limit = DEFAULT_CONTENTFUL_LIMIT,
	page = 1,
	search,
	select,
}: QueryParamOptions): Promise<DataWithPaginationResponse<MovieSummary>> {
	const skip = (page - 1) * limit;

	const entries = await cdaClient.getEntries<MovieEntrySkeleton>({
		content_type: 'movie',
		limit: limit,
		skip: skip || 0,
		// @ts-ignore: Contentful type doesn't recognize Text input as acceptable order,
		// but SDK does process that successfully.
		order: ['fields.title'],
		'fields.title[match]': search,
		...(select?.length && { select }),
	});

	const parsedMovies = entries.items.map(parseMovieSummary);
	const totalPages = Math.ceil(entries.total / limit);

	return { data: parsedMovies, totalPages };
}
