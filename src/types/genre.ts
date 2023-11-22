import { Movie } from './movie';

export const GENRE_CONTENT_TYPE = 'genre';

export type Genre = {
	id: string;
	title: string | null;
	movies: Array<Partial<Movie>>;
};

// Might want to add more fields here in the future
export type GenreMovie = {
	id: string;
};
