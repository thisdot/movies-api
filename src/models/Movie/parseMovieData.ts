import { Movie, MovieSummary } from './type';
import { GenreContentfulEntry } from '../Genre/GenreModel';

// TODO: Fix contentful types, take out the any

// Function to parse basic movie data (MovieSummary)
export function parseMovieSummary(entry: any): MovieSummary {
	const { sys, fields } = entry;

	return {
		id: sys.id,
		title: fields.title || '',
		posterUrl: fields.posterUrl || '',
		rating: fields.rating || '',
	};
}

// Function to parse detailed movie data (MovieModel)
export function parseMovieModel(entry: any): Movie {
	const summary = parseMovieSummary(entry);
	const { fields } = entry;

	return {
		...summary,
		summary: fields.summary || '',
		duration: fields.duration || '',
		directors: fields.directors || [],
		mainActors: fields.mainActors || [],
		genres: ((fields.genres as Array<GenreContentfulEntry>) || [])?.map(
			(genre) => (genre.fields?.title as string) || ''
		),
		datePublished: fields.datePublished || '',
		ratingValue: fields.ratingValue || 0,
		bestRating: fields.bestRating || 0,
		worstRating: fields.worstRating || 0,
		writers: fields.writers || [],
	};
}
