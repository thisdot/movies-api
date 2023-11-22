import { MovieContentfulEntry, GenreContentfulEntry } from "../../types/contentful";
import { MovieSummary, Movie } from "../../types/movie";

// Function to parse basic movie data (MovieSummary)
export function parseMovieSummary(entry: MovieContentfulEntry): MovieSummary {
	const { sys, fields } = entry;

	return {
		id: sys.id,
		title: fields.title,
		posterUrl: fields.posterUrl,
		rating: fields.rating,
	};
}

// Function to parse detailed movie data (MovieModel)
export function parseMovie(entry: MovieContentfulEntry, includeMoviesInGenre?: boolean): Movie {
	const { fields } = entry;

	return {
		...parseMovieFields(entry),
		genres:
			(fields.genres as GenreContentfulEntry[]).map((genre: GenreContentfulEntry) => ({
				id: genre.sys.id,
				title: genre.fields.title,
				...(includeMoviesInGenre && {
					movies: (genre.fields?.movies as MovieContentfulEntry[])?.map(parseMovieFields),
				}),
			})) || [],
	};
}

//Helper function to parse the movie data
function parseMovieFields(entry: MovieContentfulEntry): Omit<Movie, 'genres'> {
	const summary = parseMovieSummary(entry);
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
