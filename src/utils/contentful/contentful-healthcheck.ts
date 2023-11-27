import { cdaClient } from './contentful';

export const getContentfulHealth = async () => {
	try {
		const cdaSpace = await cdaClient.getSpace();
		return !!cdaSpace?.name;
	} catch {
		return false;
	}
};
