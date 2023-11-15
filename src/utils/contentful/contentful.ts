import { createClient, Environment } from 'contentful-management';
import { createClient as createCDAClient } from 'contentful';
import * as dotenv from 'dotenv';

// load dotenv config
dotenv.config();

export const CONTENTFUL_LIMIT = 25;

export const cdaClient = createCDAClient({
	space: `${process.env.CONTENTFUL_SPACE_ID}`,
	accessToken: `${process.env.CONTENTFUL_DELIVERY_API_TOKEN}`,
});

const cmaClient = createClient({
	accessToken: `${process.env.CONTENTFUL_CONTENT_MANAGEMENT_API_TOKEN}`,
});

export async function getCMAEnvironment(): Promise<Environment> {
	const space = await cmaClient.getSpace(`${process.env.CONTENTFUL_SPACE_ID}`);
	const environment = await space.getEnvironment(`${process.env.CONTENTFUL_ENVIRONMENT}`);

	return environment;
}
