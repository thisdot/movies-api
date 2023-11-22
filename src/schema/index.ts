import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { genreResolvers, genreTypeDefs } from './genre';
import { paginationTypeDefs } from './pagination.typedefs';
import { movieTypeDefs } from './movie/movie.typedefs';
import { movieResolvers } from './movie/movie.resolvers';

export const typeDefs = mergeTypeDefs([paginationTypeDefs, genreTypeDefs, movieTypeDefs]);

export const resolvers = mergeResolvers([genreResolvers, movieResolvers]);
