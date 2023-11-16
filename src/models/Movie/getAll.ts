import parseMovieData from './parseMovieData';
import { cdaClient, DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import { PaginationOptions } from '../../types/pagination';
import { DataWithPaginationResponse } from '../../types/apiResponse';
import { MovieModel } from './type';

type Options = PaginationOptions & {
	genre?: string;
	search?: string;
	ids?: Array<string>;
};

export default async function getAll({
	limit = DEFAULT_CONTENTFUL_LIMIT,
	page = 1,
	search,
	ids,
}: Options): Promise<DataWithPaginationResponse<MovieModel>> {
	try {
		const skip = (page - 1) * limit;

		const entries = await cdaClient.getEntries({
			content_type: 'movie',
			limit: limit,
			skip: skip || 0,
			'fields.title[match]': search,
			...(ids && { 'sys.id[in]': ids?.join(',') }),
		});

		const data = entries.items.map((entry) => parseMovieData(entry));
		const totalPages = Math.ceil(entries.total / limit);
		return { data, totalPages };
	} catch (e) {
		console.error(String(e));
		throw e;
	}
}
