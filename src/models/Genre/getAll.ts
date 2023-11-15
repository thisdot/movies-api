import { cdaClient, ContentfulPaginationRequest, CONTENTFUL_LIMIT } from '../../utils/contentful';
import GenreModel from './GenreModel';

export default async function getAll({
	limit = CONTENTFUL_LIMIT,
	skip = 0,
}: ContentfulPaginationRequest) {
	try {
		const response = await cdaClient.getEntries({
			content_type: 'genre',
			select: ['sys.id', 'fields.title', 'fields.movies'],
			skip,
			limit,
			order: ['fields.title'],
			include: 0, // remove unecessary data - we don't care about includes here
		});

		return response.items.map((entry) => new GenreModel(entry).toGenre());
	} catch (e) {
		console.log('======= something went wrong fetch =======');
		console.log(String(e));
		throw e;
	}
}
