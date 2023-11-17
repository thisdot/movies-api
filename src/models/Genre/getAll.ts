import { DataWithPaginationResponse } from '../../types/apiResponse';
import { cdaClient, DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import { PaginationOptions } from '../../types/pagination';
import { Genre, GenreContentfulEntry } from './GenreModel';
import parseGenre from './parseGenre';

export const ContentfulIncludeOptions = {
	movies: 1,
	moviesWithGenre: 2,
} as const;

type ContentfulIncludeOptions =
	(typeof ContentfulIncludeOptions)[keyof typeof ContentfulIncludeOptions];

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
	include,
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
			...(title && { 'fields.title[match]': title }),
		});

		const data = response.items.map((entry) =>
			parseGenre(entry as GenreContentfulEntry, include && include > 0)
		);
		return { data, totalPages: Math.ceil(response.total / limit) };
	} catch (err) {
		console.error(err);
		throw err;
	}
}
