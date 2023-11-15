import { Entry, EntrySkeletonType, FieldsType } from 'contentful';

type GenreContentfulEntry = Entry<EntrySkeletonType<FieldsType, string>, undefined, string>;

export type Genre = {
	id: string;
	title: string | null;
	movies: Array<GenreMovie>;
};

// Might want to add more fields here in the future
export type GenreMovie = {
	id: string;
};

export default class GenreModel {
	public get id() {
		return this.entry.sys.id;
	}

	public get title(): string | null {
		return (this.entry.fields?.title as string) || '';
	}
	public set title(value: string | null) {
		this.entry.fields.title = value;
	}

	public get movies(): Array<GenreMovie> {
		return ((this.entry.fields?.movies as Array<GenreContentfulEntry>) || []).map((movie) => ({
			id: movie.sys.id,
		}));
	}
	public set movies(value: Array<GenreMovie>) {
		this.entry.fields.movies = value.map((movie) => ({
			sys: { id: movie.id },
		}));
	}

	constructor(private entry: GenreContentfulEntry) {}

	toGenre(): Genre {
		return {
			id: this.id,
			title: this.title,
			movies: this.movies,
		};
	}
}
