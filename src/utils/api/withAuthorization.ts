import {
	APIGatewayProxyEvent,
	APIGatewayProxyHandler,
	APIGatewayProxyResult,
	Callback,
	Context,
} from 'aws-lambda';
import { validateAuthorizationToken } from '@utils/api/apiAuth';

export function withAuthorization(handler: APIGatewayProxyHandler): APIGatewayProxyHandler {
	return async (
		event: APIGatewayProxyEvent,
		context: Context,
		callback: Callback<APIGatewayProxyResult>
	): Promise<APIGatewayProxyResult> => {
		const authorizationValidationResult = validateAuthorizationToken(event);

		if (authorizationValidationResult) {
			return authorizationValidationResult;
		}

		const result = await handler(event, context, callback);
		if (result === undefined) {
			throw new Error('Handler returned undefined');
		}
		return result;
	};
}
