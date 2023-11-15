import { DataWithPaginationResponse } from '../../types/apiResponse';
import { PaginationOptions } from '../../types/pagination';
import { cdaClient, DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import { Genre } from './GenreModel';
import parseGenre from './parseGenre';

export default async function getAll({
	page = 1,
	limit = DEFAULT_CONTENTFUL_LIMIT,
}: PaginationOptions = {}): Promise<DataWithPaginationResponse<Genre>> {
	const skip = (page - 1) * limit;

	try {
		const response = await cdaClient.getEntries({
			content_type: 'genre',
			select: ['sys.id', 'fields.title', 'fields.movies'],
			skip,
			limit,
			order: ['fields.title'],
			include: 0, // remove unecessary data - we don't care about includes here
		});

		const data = response.items.map((entry) => parseGenre(entry));
		return { data, totalPages: Math.ceil(response.total / limit) };
	} catch (err) {
		console.error(err);
		throw err;
	}
}
