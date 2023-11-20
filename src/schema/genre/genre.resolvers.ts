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
		genres: async (_parent, { limit, page }) => {
			const response = await getAll({ limit: limit || DEFAULT_CONTENTFUL_LIMIT, page: page || 1 });
			return response.data || [];
		},
	},
};
