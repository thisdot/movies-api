import {
	APIGatewayProxyEvent,
	APIGatewayProxyHandler,
	APIGatewayProxyResult,
	Callback,
	Context,
} from 'aws-lambda';
import { isTokenValid } from '@utils/api/apiAuth';
import {
	forbiddenResponse,
	noContentResponse,
	unauthorizedResponse,
} from '@utils/api/apiResponses';

export function withAuthorization(handler: APIGatewayProxyHandler): APIGatewayProxyHandler {
	return async (
		event: APIGatewayProxyEvent,
		context: Context,
		callback: Callback<APIGatewayProxyResult>
	): Promise<APIGatewayProxyResult> => {
		const authorization = event.headers?.['authorization'] || '';

		if (!authorization) {
			return unauthorizedResponse;
		}

		if (!isTokenValid(authorization)) {
			return forbiddenResponse;
		}

		const result = await handler(event, context, callback);

		// Provide a default response if the handler returns void
		if (result === undefined) {
			return noContentResponse;
		}

		return result;
	};
}
