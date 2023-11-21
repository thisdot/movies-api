import { Genre, GenreContentfulEntry } from './GenreModel';
import { parseMovieSummary } from '../Movie/parseMovieData';
import { MovieContentfulEntry } from '../Movie/type';

export function parseGenreWithMovieData(entry: GenreContentfulEntry): Genre {
	return {
		id: entry.sys.id,
		title: entry.fields.title as string,
		movies: ((entry.fields?.movies as MovieContentfulEntry[]) || []).map(parseMovieSummary),
	};
}

export function parseGenreWithMovieIds(entry: GenreContentfulEntry): Genre {
	return {
		id: entry.sys.id,
		title: entry.fields.title as string,
		movies: ((entry.fields?.movies as MovieContentfulEntry[]) || []).map((movie) => ({
			id: movie.sys.id,
		})),
	};
}
