import isNil from "lodash/isNil";
import { ContentfulIncludeOptions, CONTENTFUL_INCLUDE, MovieEntrySkeleton } from "../../types/contentful";
import { Movie, MOVIE_CONTENT_TYPE } from "../../types/movie";
import { cdaClient } from "../../utils/contentful";
import { parseMovie } from "./parseMovieData";


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

	const includeMoviesInGenres = !isNil(include) && include > 1;

	const parsedMovie = parseMovie(response, includeMoviesInGenres);

	return parsedMovie;
}
