import contentfulManagement, { Environment } from 'contentful-management';
import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

type GenreMap = {
	[genre: string]: string;
};

type Movie = {
	title: string;
	posterURL: string;
	summary: string;
	duration: string;
	director: string[];
	mainActors: string[];
	genres: string[];
	datePublished: string;
	rating: string;
	ratingValue: number;
	bestRating: number;
	worstRating: number;
	writers: string[];
};

type Sys = {
	id: string;
	linkType: string;
	type: string;
};

type MovieGenres = Record<string, { sys: Sys }[]>;

// load dotenv config
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { CONTENTFUL_CONTENT_MANAGEMENT_API_TOKEN, CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT } =
	process.env;

// Replace with the actual path to your seed file
const seedData = JSON.parse(fs.readFileSync(join(__dirname, 'seedData.json'), 'utf8'));

const client = contentfulManagement.createClient({
	accessToken: `${CONTENTFUL_CONTENT_MANAGEMENT_API_TOKEN}`,
});

const spaceId = `${CONTENTFUL_SPACE_ID}`;
const environmentId = `${CONTENTFUL_ENVIRONMENT}`;

const createGenreEntries = async (environment: Environment, genres: string[]) => {
	console.log('Creating genre entries...');

	const genreEntries: GenreMap = {};
	for (const genre of genres) {
		if (!genreEntries[genre]) {
			const entry = await environment.createEntry('genre', {
				fields: {
					title: {
						'en-US': genre,
					},
				},
			});
			genreEntries[genre] = entry.sys.id;
		}
	}
	return genreEntries;
};

const createMovieEntries = async (
	environment: Environment,
	movie: Movie,
	genreEntries: GenreMap
) => {
	console.log(`Creating movie entry for ${movie.title}...`);

	const genreLinks = movie.genres.map((genre) => ({
		sys: {
			type: 'Link',
			linkType: 'Entry',
			id: genreEntries[genre],
		},
	}));

	const movieEntry = await environment.createEntry('movie', {
		fields: {
			title: {
				'en-US': movie.title,
			},
			posterUrl: {
				'en-US': movie.posterURL,
			},
			summary: {
				'en-US': movie.summary,
			},
			duration: {
				'en-US': movie.duration,
			},
			directors: {
				'en-US': movie.director,
			},
			mainActors: {
				'en-US': movie.mainActors,
			},
			genres: {
				'en-US': genreLinks,
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

	// Return a mapping of genre names to the created movie entry ID
	return movie.genres.reduce((acc, genre) => {
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
	}, {} as MovieGenres);
};

const updateGenreEntries = async (
	environment: Environment,
	movieGenres: MovieGenres,
	genreEntries: GenreMap
) => {
	console.log('Updating genre entries...');

	for (const [genre, movieLinks] of Object.entries(movieGenres)) {
		// Fetch the current entry to get the version number
		const genreEntry = await environment.getEntry(genreEntries[genre]);

		// Append the new movie links to the existing ones
		const existingMovieLinks =
			(genreEntry.fields.movies && genreEntry.fields.movies['en-US']) || [];
		genreEntry.fields.movies = {
			'en-US': [...existingMovieLinks, ...movieLinks],
		};

		// Set the version header to the current version of the entry
		await genreEntry.update();
	}
};

const importDataToContentful = async () => {
	try {
		console.log('Importing data to Contentful...');

		const space = await client.getSpace(spaceId);
		const environment = await space.getEnvironment(environmentId);

		const allGenres = new Set<string>();
		seedData.forEach((movie: Movie) => movie.genres.forEach((genre) => allGenres.add(genre)));
		const genreEntries: GenreMap = await createGenreEntries(environment, Array.from(allGenres));

		// After creating all movies, update genres with the new movies
		const movieGenres: MovieGenres = {};

		for (const movie of seedData) {
			const movieEntryGenres = await createMovieEntries(environment, movie, genreEntries);

			for (const [genre, movieLinks] of Object.entries(movieEntryGenres)) {
				if (!movieGenres[genre]) {
					movieGenres[genre] = [];
				}

				if (Array.isArray(movieGenres[genre])) {
					movieGenres[genre].push(...movieLinks);
				}
			}
		}

		// Update the genre entries with the linked movie entries
		await updateGenreEntries(environment, movieGenres, genreEntries);
		console.log('Data imported successfully!');
	} catch (error) {
		console.log('Error importing data to Contentful');
		console.error(error);
	}
};

void importDataToContentful();
