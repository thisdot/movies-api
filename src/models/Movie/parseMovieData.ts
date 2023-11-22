import { GenreContentfulEntry, MovieContentfulEntry } from '../../types/contentful';
import { Movie, MovieSummary } from '../../types/movie';

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
export function parseMovie(entry: MovieContentfulEntry): Movie {
	const summary = parseMovieSummary(entry);
	const { fields } = entry;

	return {
		...summary,
		summary: fields.summary,
		duration: fields.duration,
		directors: fields.directors,
		mainActors: fields.mainActors,
		genres: ((fields.genres as Array<GenreContentfulEntry>) || [])?.map(
			(genre) => genre.fields?.title
		),
		datePublished: fields.datePublished,
		ratingValue: fields.ratingValue,
		bestRating: fields.bestRating,
		worstRating: fields.worstRating,
		writers: fields.writers,
	};
}
