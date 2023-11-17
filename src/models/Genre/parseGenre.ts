import { Genre, GenreContentfulEntry } from './GenreModel';
import parseMovieData from '../Movie/parseMovieData';
import { MovieContentfulEntry } from '../Movie/type';

export default function parseGenre(entry: GenreContentfulEntry, getMovieData?: boolean): Genre {
	return {
		id: entry.sys.id,
		title: entry.fields.title as string,
		movies: getMovieData
			? ((entry.fields?.movies as MovieContentfulEntry[]) || []).map((movie) =>
					parseMovieData(movie)
			  )
			: ((entry.fields?.movies as MovieContentfulEntry[]) || []).map((movie) => ({
					id: movie.sys.id,
			  })),
	};
}
