import { isTokenValid } from '@utils/api/apiAuth';
import { APIGatewayRequestSimpleAuthorizerHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayRequestSimpleAuthorizerHandlerV2 = async (event) => {
	const authorization = event.headers?.['authorization'] || '';

	// removing the initial "Bearer "
	const token = authorization.substring(7);
	const isAuthorized = isTokenValid(token);

	// ref: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.payload-format-response
	return {
		isAuthorized: isAuthorized,
		context: {},
	};
};
