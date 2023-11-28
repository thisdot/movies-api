import { authorizedJWTs } from '@utils/api/apiAuth';
import { APIGatewayRequestAuthorizerEventV2, Callback, Context } from 'aws-lambda';
import { handler } from './authorizer';

describe('authorizer', () => {
	const scenarios: [string, string, boolean][] = [
		['should return denied response', 'aFakeToken', false],
		['should return allowed response', authorizedJWTs[0], true],
	];
	it.each(scenarios)('%s', async (_title, token, effect) => {
		// event type is APIGatewayRequestAuthorizerEvent, instead of adding null or empty to required props
		// let's just use unknown and add the props we need for the unit test
		const event: unknown = {
			headers: { authorization: `Bearer ${token}` },
		};
		const result = await handler(
			event as APIGatewayRequestAuthorizerEventV2,
			{} as Context,
			{} as Callback
		);
		const expectedResult = {
			isAuthorized: effect,
			context: {},
		};
		expect(result).toEqual(expectedResult);
	});
});
