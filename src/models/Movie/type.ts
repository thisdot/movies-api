import { Entry, EntrySkeletonType, FieldsType } from 'contentful';
import { Genre } from '../Genre/GenreModel';
import { Maybe } from '../../generated/graphql';

export const MOVIE_CONTENT_TYPE = 'movie';

export type Movie = {
	id: string;
	title: string;
	posterUrl: string;
	summary: string;
	duration: string;
	directors: string[];
	mainActors: string[];
	genres: Maybe<Genre>[];
	datePublished: string;
	rating: string;
	ratingValue: number;
	bestRating: number;
	worstRating: number;
	writers: string[];
};

export type MovieSummary = Pick<Movie, 'id' | 'title' | 'posterUrl' | 'rating'>;

export type MovieContentfulEntry = Entry<EntrySkeletonType<FieldsType, string>, undefined, string>;
