export const CONTENTFUL_INCLUDE = {
	noInclude: 0, // this adds at least the linked IDs
	movies: 2,
	moviesWithGenre: 3,
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
