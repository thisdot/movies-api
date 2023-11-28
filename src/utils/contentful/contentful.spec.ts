import { createClient, Environment } from 'contentful-management';
import { cdaClient, getCMAEnvironment } from './contentful';
import { ContentfulClientApi, createClient as createCDAClient } from 'contentful';

const dummyEnvironment = {
	accessToken: 'DUMMYTOKEN',
};

const mockCreateClient = createClient as jest.Mock;
jest.mock('contentful-management', () => ({
	createClient: jest.fn().mockReturnValue({
		getSpace: jest.fn().mockResolvedValue({
			getEnvironment: jest.fn().mockResolvedValue({
				accessToken: 'DUMMYTOKEN',
			}),
		}),
	}),
}));

const mockCreateCDAClient = createCDAClient as jest.Mock;
jest.mock('contentful', () => ({
	createClient: jest.fn().mockReturnValue({}),
}));

describe('CDA - client', () => {
	let localCdaClient: ContentfulClientApi<undefined>;
	beforeAll(async () => {
		localCdaClient = cdaClient;
	});

	it('calls createClient from CDA', () => {
		expect(mockCreateCDAClient).toHaveBeenCalledTimes(1);
		expect(localCdaClient).toBeTruthy();
	});
});

describe('CMA - .getEnviroment', () => {
	let environment: Environment;
	let mockGetSpace: jest.Mock;
	beforeAll(async () => {
		environment = await getCMAEnvironment();
	});

	it('calls create client with expected arguments', () => {
		expect(mockCreateClient).toHaveBeenCalledTimes(1);
		expect(mockCreateClient).toHaveBeenCalledWith({
			accessToken: 'MOCK_CONTENTFUL_CONTENT_MANAGEMENT_API_TOKEN',
		});
	});

	it('calls getSpace function from created client result with expected argument', () => {
		mockGetSpace = mockCreateClient.mock.results[0].value.getSpace;
		expect(mockGetSpace).toHaveBeenCalledTimes(1);
		expect(mockGetSpace).toHaveBeenCalledWith('MOCK_CONTENTFUL_SPACE_ID');
	});

	it('calls getCMAEnvironment function from space result with expected argument', async () => {
		const mockGetSpaceResult = await mockGetSpace.mock.results[0].value;
		const mockGetCMAEnvironment = mockGetSpaceResult.getEnvironment;
		expect(mockGetCMAEnvironment).toHaveBeenCalledTimes(1);
		expect(mockGetCMAEnvironment).toHaveBeenCalledWith('MOCK_CONTENTFUL_ENVIRONMENT');
	});

	it('returns expected result', () => {
		expect(environment).toEqual(dummyEnvironment);
	});
});
