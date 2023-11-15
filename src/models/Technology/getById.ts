import { getCMAEnvironment } from '../../utils/contentful';
import TechnologyModel from './TechnologyModel';

export default async function getById(id: string) {
	const environment = await getCMAEnvironment();
	const entry = await environment.getEntry(id);

	return new TechnologyModel(entry);
}
