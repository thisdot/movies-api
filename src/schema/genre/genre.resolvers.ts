import { Resolvers } from '../../generated/graphql';
import getAll from '../../models/Genre/getAll';
import getById from '../../models/Genre/getById';
import { DEFAULT_CONTENTFUL_LIMIT } from '../../utils/contentful';

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
			});
			return {
				page,
				perPage,
				totalPages: response.totalPages,
				nodes: response.data || [],
			};
		},
	},
};
