import { parseMovieSummary } from './parseMovieData';
import { cdaClient, DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import { PaginationOptions } from '../../types/pagination';
import { DataWithPaginationResponse } from '../../types/apiResponse';
import { MovieSummary } from './type';

type QueryParamOptions = PaginationOptions & {
	genre?: string;
	search?: string;
};

export default async function getAll({
	limit = DEFAULT_CONTENTFUL_LIMIT,
	page = 1,
	search,
}: QueryParamOptions): Promise<DataWithPaginationResponse<MovieSummary>> {
	const skip = (page - 1) * limit;

	const entries = await cdaClient.getEntries({
		content_type: 'movie',
		limit: limit,
		skip: skip || 0,
		order: ['fields.title'],
		'fields.title[match]': search,
	});

	const parsedMovies = entries.items.map((entry) => parseMovieSummary(entry));
	const totalPages = Math.ceil(entries.total / limit);

	return { data: parsedMovies, totalPages };
}
