import { APIGatewayRequestAuthorizerHandler } from 'aws-lambda';
import { isTokenValid } from '@utils/api/apiAuth';

export const handler: APIGatewayRequestAuthorizerHandler = async (event) => {
	const authorization = event.headers?.['Authorization'] || '';

	// removing the initial "Bearer "
	const token = authorization.substring(7);
	const isAuthorized = isTokenValid(token);

	// ref: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.payload-format-response
	return {
		principalId: 'simpleAuthorizerPrincipal', // principal user identification associated with the token sent by the client - let's hardcode for simplicity
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Effect: isAuthorized ? 'Allow' : 'Deny',
					Action: ['execute-api:Invoke'],
					Resource: ['*'], // all resources in this project - for this purpose this is fine
				},
			],
		},
	};
};
