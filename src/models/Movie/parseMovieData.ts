import { MovieModel } from './type';
import { GenreContentfulEntry } from '../Genre/GenreModel';

// TODO: Fix contentful types, take out the any
export default function parseMovieData(entry: any): MovieModel {
	const { sys, fields } = entry;

	const movie: MovieModel = {
		id: sys.id,
		genres: ((fields.genres as Array<GenreContentfulEntry>) || [])?.map(
			(genre) => (genre.fields?.title as string) || ''
		),
		title: fields.title || '',
		posterUrl: fields.posterUrl || '',
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

	return movie;
}
