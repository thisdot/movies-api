import { MovieContentfulEntry, MovieModel } from './type';
import { GenreContentfulEntry } from '../Genre/GenreModel';

export default function parseMovieData(entry: MovieContentfulEntry): MovieModel {
	const { sys, fields } = entry;
	const movie = {
		...fields,
		id: sys.id,
		genres: ((fields.genres as Array<GenreContentfulEntry>) || [])?.map(
			(genre) => genre.fields?.title || ''
		),
	};

	return movie as MovieModel;
}
