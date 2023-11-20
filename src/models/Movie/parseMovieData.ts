import { MovieSummary } from './type';

// TODO: Fix contentful types, take out the any
export default function parseMovieData(entry: any): MovieSummary {
	const { sys, fields } = entry;

	const movie: MovieSummary = {
		id: sys.id,
		title: fields.title || '',
		posterUrl: fields.posterUrl || '',
		rating: fields.rating || '',
	};

	return movie;
}
