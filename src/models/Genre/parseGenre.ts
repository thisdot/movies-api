import {
	ContentfulIncludeOptions,
	GenreContentfulEntry,
	MovieContentfulEntry,
} from '@customTypes/contentful';
import { Genre } from '@customTypes/genre';
import { parseMovie, parseMovieSummary } from '@models/Movie/parseMovieData';

export function parseGenreWithMovieData(
	entry: GenreContentfulEntry,
	include: ContentfulIncludeOptions
): Genre {
	const parseMethod = include > 1 ? parseMovie : parseMovieSummary;

	return {
		id: entry.sys.id,
		title: entry.fields.title,
		movies: ((entry.fields?.movies as MovieContentfulEntry[]) || []).map(parseMethod),
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
