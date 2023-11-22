import { ApolloServer, BaseContext } from '@apollo/server';
import { startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda';
import { resolvers, typeDefs } from '../schema';
import { Genre } from '../types/genre';

export interface MyContext extends BaseContext {
	dataSources: {
		genres: Genre[];
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

		if (process.env.SLS_STAGE !== 'prod') {
			return { ...formattedError, message };
		}

		return { message: message.message || message };
	},
	introspection: process.env.SLS_STAGE !== 'prod',
});

export const server = startServerAndCreateLambdaHandler<MyContext>(apolloServer, {
	context: async () => ({ dataSources: { genres: [] } }),
});
