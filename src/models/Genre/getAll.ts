import { DataWithPaginationResponse } from '../../types/apiResponse';
import { ContentfulIncludeOptions, CONTENTFUL_INCLUDE } from '../../types/contentful';
import { PaginationOptions } from '../../types/pagination';
import { cdaClient, DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import { Genre } from './GenreModel';
import parseGenre from './parseGenre';

type GetAllOptions = PaginationOptions & {
	include?: ContentfulIncludeOptions;
	query?: {
		id?: string;
		title?: string;
	};
};

export default async function getAll({
	page = 1,
	limit = DEFAULT_CONTENTFUL_LIMIT,
	include = CONTENTFUL_INCLUDE.noInclude,
	query = {},
}: GetAllOptions = {}): Promise<DataWithPaginationResponse<Genre>> {
	const { id, title } = query;
	const skip = (page - 1) * limit;

	try {
		const response = await cdaClient.getEntries({
			content_type: 'genre',
			select: ['sys.id', 'fields.title', 'fields.movies'],
			skip,
			limit,
			order: ['fields.title'],
			include,
			...(id && { 'sys.id': id }),
			...(title && { 'fields.title': title }),
		});

		const data = response.items.map((entry) => parseGenre(entry));
		return { data, totalPages: Math.ceil(response.total / limit) };
	} catch (err) {
		console.error(err);
		throw err;
	}
}
