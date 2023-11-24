import { EntryCollection, EntryFieldTypes, Entry } from 'contentful';
import { Link } from 'contentful-management';

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

export type GenreLink = Link<'Entry'>;
export type GenreEntrySkeleton = {
	contentTypeId: 'genre';
	fields: {
		title: EntryFieldTypes.Text;
		movies: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<MovieEntrySkeleton>>;
	};
};
export type GenreContentfulEntryCollection = EntryCollection<GenreEntrySkeleton, undefined, string>;
export type GenreContentfulEntry = Entry<GenreEntrySkeleton, undefined, string>;

export type ContentfulGenreEntryFields = {
	title: string;
	movies: MovieLink[];
};

export type MovieLink = Link<'Entry'>;
export type MovieEntrySkeleton = {
	contentTypeId: 'movie';
	fields: {
		title: EntryFieldTypes.Text;
		posterUrl: EntryFieldTypes.Text;
		summary: EntryFieldTypes.Text;
		duration: EntryFieldTypes.Text;
		directors: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
		mainActors: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
		genres: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<GenreEntrySkeleton>>;
		datePublished: EntryFieldTypes.Text;
		rating: EntryFieldTypes.Text;
		ratingValue: EntryFieldTypes.Number;
		bestRating: EntryFieldTypes.Number;
		worstRating: EntryFieldTypes.Number;
		writers: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
	};
};
export type MovieContentfulEntryCollection = EntryCollection<MovieEntrySkeleton, undefined, string>;
export type MovieContentfulEntry = Entry<MovieEntrySkeleton, undefined, string>;

export type ContentfulMovieEntryFields = {
	title: string;
	posterUrl?: string | null;
	summary?: string | null;
	duration?: string | null;
	directors?: string[] | null;
	mainActors?: string[] | null;
	genres?: GenreLink[] | null;
	datePublished?: string | null;
	rating?: string | null;
	ratingValue?: number | null;
	bestRating?: number | null;
	worstRating?: number | null;
	writers?: string[] | null;
};
