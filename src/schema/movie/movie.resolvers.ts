import { Resolvers } from '../../generated/graphql';
import { DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';
import getAllMovies from '../../models/Movie/getAll';
import { CONTENTFUL_INCLUDE } from '../../types/contentful';
import getMovieById from '../../models/Movie/getById';

export const movieResolvers: Resolvers = {
	Query: {
		movie: async (_parent, { id }) => {
			const movie = await getMovieById(id, {
				include: CONTENTFUL_INCLUDE.genresWithMovies,
			});
			if (!movie) {
				throw new Error('Not Found');
			}
			return movie;
		},
		movies: async (_parent, { pagination }) => {
			const perPage = pagination?.perPage || DEFAULT_CONTENTFUL_LIMIT;
			const page = pagination?.page || 1;
			const response = await getAllMovies({
				limit: perPage,
				page: page,
				include: CONTENTFUL_INCLUDE.genresWithMovies,
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
