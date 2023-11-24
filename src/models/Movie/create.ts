import { getCMAEnvironment } from '@utils/contentful';
import { ContentfulMovieEntryFields } from '@customTypes/contentful';

export default async function create(movie: ContentfulMovieEntryFields) {
	const environment = await getCMAEnvironment();

	const entry = await environment.createEntry('movie', {
		fields: {
			title: {
				'en-US': movie.title,
			},
			posterUrl: {
				'en-US': movie.posterUrl,
			},
			summary: {
				'en-US': movie.summary,
			},
			duration: {
				'en-US': movie.duration,
			},
			directors: {
				'en-US': movie.directors,
			},
			mainActors: {
				'en-US': movie.mainActors,
			},
			genres: {
				'en-US': movie.genres,
			},
			datePublished: {
				'en-US': movie.datePublished,
			},
			rating: {
				'en-US': movie.rating,
			},
			ratingValue: {
				'en-US': movie.ratingValue,
			},
			bestRating: {
				'en-US': movie.bestRating,
			},
			worstRating: {
				'en-US': movie.worstRating,
			},
			writers: {
				'en-US': movie.writers,
			},
		},
	});
	await entry.publish();

	return entry;
}
