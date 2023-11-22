import { GenreContentfulEntry, MovieContentfulEntry } from '../../types/contentful';
import { Genre } from '../../types/genre';
import { parseMovieSummary } from '../Movie/parseMovieData';

export function parseGenreWithMovieData(entry: GenreContentfulEntry): Genre {
	return {
		id: entry.sys.id,
		title: entry.fields.title,
		movies: ((entry.fields?.movies as MovieContentfulEntry[]) || []).map(parseMovieSummary),
	};
}

export function parseGenreWithMovieIds(entry: GenreContentfulEntry): Genre {
	return {
		id: entry.sys.id,
		title: entry.fields.title,
		movies: ((entry.fields?.movies as MovieContentfulEntry[]) || []).map((movie) => ({
			id: movie.sys.id,
		})),
	};
}
