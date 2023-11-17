import { Entry, EntrySkeletonType, FieldsType } from 'contentful';

export type MovieModel = {
	id: string;
	title: string;
	posterUrl: string;
	summary: string;
	duration: string;
	directors: string[];
	mainActors: string[];
	genres: string[];
	datePublished: string;
	rating: string;
	ratingValue: number;
	bestRating: number;
	worstRating: number;
	writers: string[];
};

export type MovieContentfulEntry = Entry<EntrySkeletonType<FieldsType, string>, undefined, string>;
