import seedData from './seedData.json';
import createGenre from '@models/Genre/create';
import updateGenre from '@models/Genre/update';
import { GenreLink, MovieLink } from '@customTypes/contentful';
import createMovie from '@models/Movie/create';

type GenreIdMap = {
	[genre: string]: string;
};

type SeedMovie = {
	title: string;
	posterUrl?: string;
	summary?: string;
	duration?: string;
	directors?: string[] | null;
	mainActors?: string[] | null;
	genres?: string[] | null;
	datePublished?: string | null;
	rating?: string | null;
	ratingValue?: number | null;
	bestRating?: number | null;
	worstRating?: number | null;
	writers?: string[] | null;
};

type MoviesInGenres = Record<string, MovieLink[]>;

const createGenreEntries = async (genres: string[]) => {
	console.log('Creating genre entries...');

	const genreEntries: GenreIdMap = {};
	for (const genre of genres) {
		if (!genreEntries[genre]) {
			const entry = await createGenre({ title: genre, movies: [] });

			genreEntries[genre] = entry.sys.id;
		}
	}
	return genreEntries;
};

const createMovieEntries = async (movie: SeedMovie, genreEntries: GenreIdMap) => {
	console.log(`Creating movie entry for ${movie.title}...`);

	const genreLinks: GenreLink[] =
		movie.genres?.map((genre) => ({
			sys: {
				type: 'Link',
				linkType: 'Entry',
				id: genreEntries[genre],
			},
		})) ?? []; // Fallback to an empty array if movie.genres is undefined;

	const movieCopy = {
		...movie,
		genres: genreLinks,
	};

	const movieEntry = await createMovie(movieCopy);

	// Return a mapping of genre names to the created movie entry ID
	return movie.genres?.reduce((acc, genre) => {
		if (!acc[genre]) {
			acc[genre] = [];
		}
		acc[genre].push({
			sys: {
				type: 'Link',
				linkType: 'Entry',
				id: movieEntry.sys.id,
			},
		});
		return acc;
	}, {} as MoviesInGenres);
};

const updateGenreEntries = async (movieGenres: MoviesInGenres, genreEntries: GenreIdMap) => {
	console.log('Updating genre entries...');

	for (const [genre, movieLinks] of Object.entries(movieGenres)) {
		await updateGenre({ movies: movieLinks }, genreEntries[genre]);
	}
};

const importDataToContentful = async () => {
	try {
		console.log('Importing data to Contentful...');

		const allGenres = new Set<string>();
		seedData.forEach((movie: SeedMovie) => movie.genres?.forEach((genre) => allGenres.add(genre)));
		const genreEntries: GenreIdMap = await createGenreEntries(Array.from(allGenres));

		// After creating all movies, update genres with the new movies
		const movieGenres: MoviesInGenres = {};

		for (const movie of seedData) {
			const movieEntryGenres = await createMovieEntries(movie, genreEntries);

			for (const [genre, movieLinks] of Object.entries(movieEntryGenres || {})) {
				if (!movieGenres[genre]) {
					movieGenres[genre] = [];
				}

				if (Array.isArray(movieGenres[genre])) {
					movieGenres[genre].push(...movieLinks);
				}
			}
		}

		// Update the genre entries with the linked movie entries
		await updateGenreEntries(movieGenres, genreEntries);
		console.log('Data imported successfully!');
	} catch (error) {
		console.log('Error importing data to Contentful');
		console.error(error);
	}
};

void importDataToContentful();
