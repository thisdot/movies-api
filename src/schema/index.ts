import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { technologyResolvers, technologyTypeDefs } from './technology';
import { genreResolvers, genreTypeDefs } from './genre';

export const typeDefs = mergeTypeDefs([technologyTypeDefs, genreTypeDefs]);

export const resolvers = mergeResolvers([technologyResolvers, genreResolvers]);
