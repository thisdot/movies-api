// Genereated from https://jwt.io/
import { forbiddenResponse, unauthorizedResponse } from '@utils/api/apiResponses';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const authorizedJWTs = [
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0MCIsIm5hbWUiOiJPcGVuSldUWzBdIn0.49JQF4ICJeqxpiIZ9x748VVOHj6FElyRm1tNpFGqaUY',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0MSIsIm5hbWUiOiJPcGVuSldUWzFdIn0.n8x8GHYe8RQYKkAoMVMlw9-FMZ57bs0HrwxBeJn3hQM',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0MiIsIm5hbWUiOiJPcGVuSldUWzJdIn0.ZV0H5kJrzOsfk3guI9pHt1bp0xzuCEFiuS4bP1XbEZE',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0MyIsIm5hbWUiOiJPcGVuSldUWzNdIn0.J43mgsvQlOK0zn7APkizIRkKphNIeXwtcabyKxoUnZo',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0NCIsIm5hbWUiOiJPcGVuSldUWzRdIn0.FEyU1vuRnD1wDw2kxuks59N9paTibhKHT8U9cpFw1dM',
];

export function isTokenValid(token: string) {
	let tokenCopy = token;

	if (tokenCopy.startsWith('Bearer ')) {
		// take out the "Bearer " part
		tokenCopy = tokenCopy.substring(7);
	}

	if (!tokenCopy) {
		return false;
	}

	return authorizedJWTs.includes(tokenCopy);
}

export function getRandomValidToken(): string {
	const randomIdx = Math.floor(Math.random() * authorizedJWTs.length);
	return authorizedJWTs[randomIdx];
}

export function validateAuthorizationToken(event: APIGatewayProxyEvent) {
	const authorization = event.headers?.['authorization'] || '';

	if (!authorization) {
		return unauthorizedResponse;
	}

	if (!isTokenValid(authorization)) {
		return forbiddenResponse;
	}

	return null;
}
