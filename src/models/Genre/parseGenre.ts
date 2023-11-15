import { Genre, GenreContentfulEntry } from './GenreModel';

export default function parseGenre(entry: GenreContentfulEntry): Genre {
	return {
		id: entry.sys.id,
		title: entry.fields.title as string,
		movies: ((entry.fields?.movies as Array<GenreContentfulEntry>) || []).map((movie) => ({
			id: movie.sys.id,
		})),
	};
}
