import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { paginationTypeDefs } from '@schema/pagination.typedefs';
import { genreResolvers, genreTypeDefs } from '@schema/genre';
import { movieTypeDefs } from '@schema/movie/movie.typedefs';
import { movieResolvers } from '@schema/movie/movie.resolvers';

export const typeDefs = mergeTypeDefs([paginationTypeDefs, genreTypeDefs, movieTypeDefs]);

export const resolvers = mergeResolvers([genreResolvers, movieResolvers]);
