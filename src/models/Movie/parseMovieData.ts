import { Movie, MovieSummary, MovieContentfulEntry } from './type';
import { GenreContentfulEntry } from '../Genre/GenreModel';

// TODO: Fix contentful types, take out the unknown

// Function to parse basic movie data (MovieSummary)
export function parseMovieSummary(entry: unknown): MovieSummary {
	// @ts-ignore
	const { sys, fields } = entry;

	return {
		id: sys.id,
		title: fields.title || '',
		posterUrl: fields.posterUrl || '',
		rating: fields.rating || '',
	};
}

// Function to parse detailed movie data (MovieModel)
export function parseMovie(entry: unknown, includeMoviesInGenre?: boolean): Movie {
	// @ts-ignore
	const { fields } = entry;

	return {
		...parseMovieFields(entry),
		genres:
			fields.genres.map((genre: GenreContentfulEntry) => ({
				id: genre.sys.id,
				title: genre.fields.title,
				...(includeMoviesInGenre && {
					movies: (genre.fields?.movies as MovieContentfulEntry[])?.map(parseMovieFields),
				}),
			})) || [],
	};
}

//Helper function to parse the movie data
function parseMovieFields(entry: unknown): Omit<Movie, 'genres'> {
	const summary = parseMovieSummary(entry);
	// @ts-ignore
	const { fields } = entry;

	return {
		...summary,
		summary: fields.summary || '',
		duration: fields.duration || '',
		directors: fields.directors || [],
		mainActors: fields.mainActors || [],
		datePublished: fields.datePublished || '',
		rating: fields.rating || '',
		ratingValue: fields.ratingValue || 0,
		bestRating: fields.bestRating || 0,
		worstRating: fields.worstRating || 0,
		writers: fields.writers || [],
	};
}
