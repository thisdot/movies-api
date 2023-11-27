import { APIGatewayProxyResult } from 'aws-lambda';

export const notFoundResponse: APIGatewayProxyResult = {
	statusCode: 404,
	body: JSON.stringify({ message: 'Not Found' }),
};

export const serverErrorResponse: APIGatewayProxyResult = {
	statusCode: 500,
	body: JSON.stringify({ error: 'Internal Server Error' }),
};

export const mountSuccessResponse = (bodyObject: object): APIGatewayProxyResult => {
	return {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify(bodyObject),
	};
};
