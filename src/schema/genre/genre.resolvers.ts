import { Resolvers } from '@generated/graphql';
import { DEFAULT_CONTENTFUL_LIMIT } from '@utils/contentful';
import { CONTENTFUL_INCLUDE } from '@customTypes/contentful';
import getById from '@models/Genre/getById';
import getAll from '@models/Genre/getAll';

export const genreResolvers: Resolvers = {
	Query: {
		genre: async (_parent, { id }) => {
			const genre = await getById(id);
			if (!genre) {
				throw new Error('Not Found');
			}
			return genre;
		},
		genres: async (_parent, { pagination }) => {
			const perPage = pagination?.perPage || DEFAULT_CONTENTFUL_LIMIT;
			const page = pagination?.page || 1;
			const response = await getAll({
				limit: perPage,
				page: page,
				include: CONTENTFUL_INCLUDE.movies,
			});
			return {
				nodes: response.data || [],
				pagination: {
					page,
					perPage,
					totalPages: response.totalPages,
				},
			};
		},
	},
};
