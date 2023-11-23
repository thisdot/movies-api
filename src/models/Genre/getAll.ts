import { DataWithPaginationResponse } from '@customTypes/apiResponse';
import {
	ContentfulIncludeOptions,
	CONTENTFUL_INCLUDE,
	GenreEntrySkeleton,
} from '@customTypes/contentful';
import { cdaClient, DEFAULT_CONTENTFUL_LIMIT } from '@utils/contentful';
import { PaginationOptions } from '@customTypes/pagination';
import { Genre } from '@customTypes/genre';
import { parseGenreWithMovieIds, parseGenreWithMovieData } from './parseGenre';

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
	const skip = Math.max(0, (page - 1) * limit);

	try {
		const response = await cdaClient.getEntries<GenreEntrySkeleton>({
			content_type: 'genre',
			skip,
			limit,
			// @ts-ignore: Contentful type doesn't recognize Text input as acceptable order,
			// but SDK does process that successfully.
			order: ['fields.title'],
			include,
			...(id && { 'sys.id': id }),
			...(title && { 'fields.title[match]': title }),
		});

		const data = response.items.map((entry) => {
			if (include > 0) {
				return parseGenreWithMovieData(entry, include);
			}

			return parseGenreWithMovieIds(entry);
		});
		return { data, totalPages: Math.ceil(response.total / limit) };
	} catch (err) {
		console.error(err);
		throw err;
	}
}
