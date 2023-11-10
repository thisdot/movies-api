import { APIGatewayProxyHandler } from 'aws-lambda';
import { getContentfulHealth } from '../utils/contentful';

export type HealthCheckResult = {
	contentful: boolean;
};

export const handler: APIGatewayProxyHandler = async () => {
	const result: HealthCheckResult = {
		contentful: await getContentfulHealth(),
	};

	const hasFailedCheck = Object.values(result).includes(false);
	const statusCode = hasFailedCheck ? 503 : 200;

	return {
		statusCode: statusCode,
		body: JSON.stringify(result),
		headers: {
			'Content-Type': 'application/json',
		},
	};
};
