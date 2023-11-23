import { APIGatewayProxyHandler } from 'aws-lambda';
import { getRandomValidToken } from '@utils/api/apiAuth';

export const handler: APIGatewayProxyHandler = async () => {
	const validToken = getRandomValidToken();
	return {
		statusCode: 200,
		body: JSON.stringify({ token: validToken }),
	};
};
