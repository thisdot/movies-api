import {
	CONTENTFUL_INCLUDE,
	ContentfulIncludeOptions,
	CustomContentfulError,
	GenreEntrySkeleton,
} from '@customTypes/contentful';
import { GENRE_CONTENT_TYPE, Genre } from '@customTypes/genre';
import { cdaClient } from '@utils/contentful';
import { parseGenreWithMovieIds } from './parseGenre';

type GetByIdOptions = {
	include?: ContentfulIncludeOptions;
};

export default async function getById(
	id: string,
	{ include = CONTENTFUL_INCLUDE.noInclude }: GetByIdOptions = {}
): Promise<Genre | null> {
	try {
		// Contenful getEntry doesn't specify contentType, need to check its return
		const response = await cdaClient.getEntry<GenreEntrySkeleton>(id, { include });

		if (response?.sys?.contentType?.sys?.id !== GENRE_CONTENT_TYPE) {
			return null;
		}

		return parseGenreWithMovieIds(response);
	} catch (err) {
		// Contentful throws error when NotFound, let's transform into an empty return
		// so the controller handles the 404 there
		const contentfulError = err as CustomContentfulError;
		if (contentfulError?.sys?.id === 'NotFound') {
			return null;
		}
		console.error(err);
		throw err;
	}
}
