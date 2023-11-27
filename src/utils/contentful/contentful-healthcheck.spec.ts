import { cdaClient } from './contentful';
import { getContentfulHealth } from './contentful-healthcheck';

jest.mock('./contentful', () => ({
	cdaClient: {
		getSpace: jest.fn(),
	},
}));

describe('.healthcheck', () => {
	describe('when connection is successful', () => {
		let result: boolean;
		beforeAll(async () => {
			(cdaClient.getSpace as jest.Mock).mockImplementation(() => ({
				name: 'aFake cda space name',
			}));
			result = await getContentfulHealth();
		});
		it('should return 200', () => {
			expect(result).toEqual(true);
		});
	});
	describe('when connection is unsuccessful', () => {
		let result: boolean;
		beforeAll(async () => {
			(cdaClient.getSpace as jest.Mock).mockImplementation(() => ({}));
			result = await getContentfulHealth();
		});
		it('should return 500', () => {
			expect(result).toEqual(false);
		});
	});
});
