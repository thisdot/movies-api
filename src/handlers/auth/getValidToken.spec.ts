import { authorizedJWTs } from '@utils/api/apiAuth';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { handler } from './getValidToken';

describe('authorizer', () => {
	it('should return a valid token', async () => {
		const result = await handler({} as APIGatewayProxyEvent, {} as Context, {} as Callback);

		// no try/catch here, if thrown than it means this test failed
		const parsedBody = JSON.parse(result?.body as string);
		expect(authorizedJWTs).toContain(parsedBody?.token);
	});
});
