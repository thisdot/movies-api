import { createClient, Environment } from 'contentful-management';
import { createClient as createCDAClient } from 'contentful';
import * as dotenv from 'dotenv';

// load dotenv config
dotenv.config();

export const DEFAULT_CONTENTFUL_LIMIT = 25;

// Content Delivery API - https://www.contentful.com/developers/docs/references/content-delivery-api/
// Use this to read data from Contentful
export const cdaClient = createCDAClient({
	space: process.env.CONTENTFUL_SPACE_ID,
	accessToken: process.env.CONTENTFUL_DELIVERY_API_TOKEN,
});

// Content Management API - https://www.contentful.com/developers/docs/references/content-management-api/
// Use this to manage content in your spaces
//
// From website:
// Note: You can use the CMA to deliver and manage content, but you shouldn't use it to deliver large
// amounts of content and instead use the Content Delivery API. The structure of responses from the
// CMA differs from the CDA as GET responses retrieve the entirety of items (i.e. all localized and
// unpublished content).
const cmaClient = createClient({
	accessToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT_API_TOKEN,
});

export async function getCMAEnvironment(): Promise<Environment> {
	const space = await cmaClient.getSpace(process.env.CONTENTFUL_SPACE_ID);
	const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT);

	return environment;
}
