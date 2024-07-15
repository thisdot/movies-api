import { ApolloServer, BaseContext } from '@apollo/server';
import { startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda';
import { GraphQLError } from 'graphql';
import { Maybe } from '@generated/graphql';
import { isTokenValid } from '@utils/api/apiAuth';
import { Genre } from '@customTypes/genre';
import { Movie } from '@customTypes/movie';
import { resolvers, typeDefs } from '@schema/index';

export interface MyContext extends BaseContext {
	dataSources: {
		genres: Genre[];
		movies: Movie[];
		genre: Maybe<Genre>;
		movie: Maybe<Movie>;
	};
}
export const apolloServer = new ApolloServer<MyContext>({
	typeDefs,
	resolvers,
	formatError: (formattedError, error) => {
		if (!(error instanceof Error)) return formattedError;

		let message;
		try {
			message = JSON.parse(error.message);
		} catch {
			message = error.message;
		}

		if (process.env.SLS_STAGE !== 'production') {
			return { ...formattedError, message };
		}

		return { message: message.message || message };
	},
	introspection: true,
});

export const server = startServerAndCreateLambdaHandler<MyContext>(apolloServer, {
	context: async ({ event }) => {
		// ref: https://www.apollographql.com/docs/apollo-server/security/authentication/#api-wide-authorization
		const authorization = event.headers?.['authorization'] || '';

		if (!authorization) {
			throw new GraphQLError('User is not authorized to access this resource', {
				extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
			});
		}

		const isAuthorized = isTokenValid(authorization);
		if (!isAuthorized) {
			throw new GraphQLError('User is not authorized to access this resource', {
				extensions: { code: 'FORBIDDEN', http: { status: 403 } },
			});
		}

		return { dataSources: { genres: [], movies: [], genre: null, movie: null } };
	},
});
