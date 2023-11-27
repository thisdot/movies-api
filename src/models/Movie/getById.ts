import { cdaClient } from '@utils/contentful';
import {
	CONTENTFUL_INCLUDE,
	ContentfulIncludeOptions,
	MovieEntrySkeleton,
} from '@customTypes/contentful';
import { Movie, MOVIE_CONTENT_TYPE } from '@customTypes/movie';
import { parseMovie } from './parseMovieData';

type QueryParamOptions = {
	include?: ContentfulIncludeOptions;
};

export default async function getById(
	id: string,
	{ include = CONTENTFUL_INCLUDE.noInclude }: QueryParamOptions = {}
): Promise<Movie | null> {
	const response = await cdaClient.getEntry<MovieEntrySkeleton>(id, { include });

	// Contentful getEntry can retrieve any content type, need to check
	if (response?.sys?.contentType?.sys?.id !== MOVIE_CONTENT_TYPE) {
		return null;
	}

	const parsedMovie = parseMovie(response);

	return parsedMovie;
}
