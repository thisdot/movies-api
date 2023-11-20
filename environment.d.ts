declare global {
	namespace NodeJS {
		interface ProcessEnv {
			CONTENTFUL_CONTENT_MANAGEMENT_API_TOKEN: string;
			CONTENTFUL_DELIVERY_API_TOKEN: string;
			CONTENTFUL_SPACE_ID: string;
			CONTENTFUL_ENVIRONMENT: string;
		}
	}
}

export {};
