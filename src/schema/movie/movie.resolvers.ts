import { Resolvers } from '../../generated/graphql';
import { DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import getAllMovies from '../../models/Movie/getAll';
import { CONTENTFUL_INCLUDE } from '../../types/contentful';
import getMovieById from '../../models/Movie/getById';
import { fetchMoviesByGenre } from '../../handlers/movies/getMovies';

export const movieResolvers: Resolvers = {
	Query: {
		movie: async (_parent, { id }) => {
			const movie = await getMovieById(id, {
				include: CONTENTFUL_INCLUDE.genres,
			});
			if (!movie) {
				throw new Error('Not Found');
			}
			return movie;
		},
		movies: async (_parent, { pagination, where }) => {
			const perPage = pagination?.perPage || DEFAULT_CONTENTFUL_LIMIT;
			const page = pagination?.page || 1;
			const { search, genre } = where || {};

			if (genre) {
				const response = await fetchMoviesByGenre({
					page,
					genre,
					limit: perPage,
					search: search || '',
					include: CONTENTFUL_INCLUDE.moviesWithGenre,
				});

				if (!response) {
					throw new Error('Not Found');
				}

				return {
					pagination: {
						page,
						perPage,
						totalPages: response.totalPages,
					},
					nodes: response.result || [],
				};
			}

			const response = await getAllMovies({
				limit: perPage,
				page: page,
				include: CONTENTFUL_INCLUDE.genres,
				...(search && { search }),
			});
			return {
				pagination: {
					page,
					perPage,
					totalPages: response.totalPages,
				},
				nodes: response.data || [],
			};
		},
	},
};
