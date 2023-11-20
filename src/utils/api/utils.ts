// Type guard function
import { CustomContentfulError } from '../../types/contentful';

export function isCustomContentfulError(error: any): error is CustomContentfulError {
	return error && typeof error === 'object' && 'sys' in error && 'id' in error.sys;
}
