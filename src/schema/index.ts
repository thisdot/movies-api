import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { genreResolvers, genreTypeDefs } from './genre';

export const typeDefs = mergeTypeDefs([genreTypeDefs]);

export const resolvers = mergeResolvers([genreResolvers]);
