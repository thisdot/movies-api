import getGenreById from '@models/Genre/getById';
import { notFoundResponse, serverErrorResponse } from '@utils/api/apiResponses';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { handler } from './genreById';

const mockGenreStats = {
	id: 'aFakeIdSuccess',
	title: 'aFakeTitle',
	movies: [],
};

jest.mock('@models/Genre/getById', () => ({
	__esModule: true,
	default: jest.fn().mockImplementation((genreId: string) => {
		if (genreId === 'error') {
			throw new Error('aFakeError');
		}
		return genreId === 'aFakeIdSuccess' ? mockGenreStats : null;
	}),
}));

describe('genreById', () => {
	const successResponse = {
		statusCode: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify({ id: 'aFakeIdSuccess', title: 'aFakeTitle', totalMovies: 0 }),
	};
	const scenarios: [string, string, object][] = [
		['should return genre with stats', 'aFakeIdSuccess', successResponse],
		['should return not found response', 'aFakeIdFail', notFoundResponse],
		['should return server error', 'error', serverErrorResponse],
	];

	it.each(scenarios)('%s', async (_, genreId, expectedResponse) => {
		// event type is APIGatewayProxyEvent, instead of adding null or empty to required props
		// let's just use unknown and add the props we need for the unit test
		const event: unknown = {
			pathParameters: { id: genreId },
		};
		const result = await handler(event as APIGatewayProxyEvent, {} as Context, {} as Callback);

		expect(result).toEqual(expectedResponse);
		expect(getGenreById).toHaveBeenCalled();
	});
});
