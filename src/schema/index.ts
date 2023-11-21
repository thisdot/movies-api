import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { genreResolvers, genreTypeDefs } from './genre';
import { paginationTypeDefs } from './pagination.typedefs';

export const typeDefs = mergeTypeDefs([paginationTypeDefs, genreTypeDefs]);

export const resolvers = mergeResolvers([genreResolvers]);
