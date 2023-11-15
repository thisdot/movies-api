import { getCMAEnvironment } from './contentful';

export const getContentfulHealth = async () => {
	try {
		await getCMAEnvironment();
		return true;
	} catch {
		return false;
	}
};
