// Genereated from https://jwt.io/

export const authorizedJWTs = [
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0MCIsIm5hbWUiOiJPcGVuSldUWzBdIn0.49JQF4ICJeqxpiIZ9x748VVOHj6FElyRm1tNpFGqaUY',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0MSIsIm5hbWUiOiJPcGVuSldUWzFdIn0.n8x8GHYe8RQYKkAoMVMlw9-FMZ57bs0HrwxBeJn3hQM',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0MiIsIm5hbWUiOiJPcGVuSldUWzJdIn0.ZV0H5kJrzOsfk3guI9pHt1bp0xzuCEFiuS4bP1XbEZE',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0MyIsIm5hbWUiOiJPcGVuSldUWzNdIn0.J43mgsvQlOK0zn7APkizIRkKphNIeXwtcabyKxoUnZo',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvcGVuSnd0NCIsIm5hbWUiOiJPcGVuSldUWzRdIn0.FEyU1vuRnD1wDw2kxuks59N9paTibhKHT8U9cpFw1dM',
];

export function isTokenValid(token: string) {
	if (!token.startsWith('Bearer ')) {
		return false;
	}
	const tokenValue = token.substring(7);

	return authorizedJWTs.includes(tokenValue);
}

export function getRandomValidToken(): string {
	const randomIdx = Math.floor(Math.random() * authorizedJWTs.length);
	return authorizedJWTs[randomIdx];
}
