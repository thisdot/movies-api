import { authorizedJWTs } from '@utils/api/apiAuth';
import { APIGatewayRequestAuthorizerEvent, Callback, Context } from 'aws-lambda';
import { handler } from './authorizer';

describe('authorizer', () => {
	const scenarios: [string, string, string][] = [
		['should return denied response', 'aFakeToken', 'Deny'],
		['should return allowed response', authorizedJWTs[0], 'Allow'],
	];
	it.each(scenarios)('%s', async (_title, token, effect) => {
		// event type is APIGatewayRequestAuthorizerEvent, instead of adding null or empty to required props
		// let's just use unknown and add the props we need for the unit test
		const event: unknown = {
			headers: { Authorization: `Bearer ${token}` },
		};
		const result = await handler(
			event as APIGatewayRequestAuthorizerEvent,
			{} as Context,
			{} as Callback
		);
		const expectedResult = {
			principalId: 'simpleAuthorizerPrincipal',
			policyDocument: {
				Version: '2012-10-17',
				Statement: [
					{
						Effect: `${effect}`,
						Action: ['execute-api:Invoke'],
						Resource: ['*'],
					},
				],
			},
		};
		expect(result).toEqual(expectedResult);
	});
});
