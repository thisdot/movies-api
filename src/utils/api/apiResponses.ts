import { APIGatewayProxyResult } from 'aws-lambda';

export const notFoundResponse: APIGatewayProxyResult = {
	statusCode: 404,
	body: JSON.stringify({ message: 'Not Found' }),
};

export const serverErrorResponse: APIGatewayProxyResult = {
	statusCode: 500,
	body: JSON.stringify({ error: 'Internal Server Error' }),
};
