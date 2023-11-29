import { APIGatewayProxyEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { handler, HealthCheckResult } from './healthcheck';
import { getContentfulHealth } from '@utils/contentful';

const MOCK_GET_CONTENTFUL_HEALTH = getContentfulHealth as jest.Mock;

jest.mock('../utils/contentful', () => ({
	getContentfulHealth: jest.fn(),
}));

describe('healthcheck', () => {
	describe('when called', () => {
		const CASES: [string, HealthCheckResult, number][] = [
			['contentful should pass', { contentful: true }, 200],
			['contentful should fail', { contentful: false }, 503],
		];

		describe.each(CASES)('%s', (_, healthcheck, expectedCode) => {
			let subject: APIGatewayProxyResult | void;
			let result: HealthCheckResult;

			beforeAll(async () => {
				MOCK_GET_CONTENTFUL_HEALTH.mockResolvedValue(healthcheck.contentful);

				result = {
					contentful: await getContentfulHealth(),
				};

				subject = await handler({} as APIGatewayProxyEvent, {} as Context, {} as Callback);
			});
			it('should return correct status code and correct JSON body', () => {
				expect(subject?.statusCode).toBe(expectedCode);
				expect(subject?.body).toEqual(JSON.stringify(result));
			});
		});
	});
});
