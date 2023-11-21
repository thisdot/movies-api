export const CONTENTFUL_INCLUDE = {
	noInclude: 0, // this adds at least the linked IDs
	movies: 1,
	moviesWithGenre: 2,
	genres: 1,
	genresWithMovies: 2,
} as const;

export type ContentfulIncludeOptions = (typeof CONTENTFUL_INCLUDE)[keyof typeof CONTENTFUL_INCLUDE];

export type CustomContentfulError = Error & {
	sys?: {
		id?: string;
		type?: string;
	};
	details?: {
		type?: string;
		id?: string;
		environment?: string;
		space?: string;
	};
};
