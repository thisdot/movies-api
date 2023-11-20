import { CustomContentfulError } from '../../types/contentful';

// Type guard function to check if error is of type CustomContentfulError
export function isCustomContentfulError(error: any): error is CustomContentfulError {
	return error && typeof error === 'object' && 'sys' in error && 'id' in error.sys;
}
