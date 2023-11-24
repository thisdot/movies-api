import { getCMAEnvironment } from '@utils/contentful';
import { ContentfulGenreEntryFields } from '@customTypes/contentful';

export default async function update(data: Partial<ContentfulGenreEntryFields>, genre: string) {
	const environment = await getCMAEnvironment();

	// Fetch the current entry using the genre
	const entry = await environment.getEntry(genre);

	// Prepare updated fields
	const updatedFields = { ...entry.fields };

	// Update the genre fields in the entry
	if (data.title) {
		updatedFields.title = { 'en-US': data.title };
	}

	if (data.movies) {
		updatedFields.movies = { 'en-US': data.movies };
	}

	// Set the fields
	entry.fields = updatedFields;

	// Save the changes
	const updatedEntry = await entry.update();

	// Publish the changes
	await updatedEntry.publish();

	return entry;
}
