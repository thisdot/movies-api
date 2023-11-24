import { getCMAEnvironment } from '@utils/contentful';
import { Genre } from '@customTypes/genre';

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export default async function create(data: WithRequired<Omit<Genre, 'id'>, 'movies'>) {
	const environment = await getCMAEnvironment();

	const entry = await environment.createEntry('genre', {
		fields: {
			title: {
				'en-US': data.title,
			},
			movies: {
				'en-US': data.movies || [],
			},
		},
	});
	await entry.publish();

	return entry;
}
