import PermissionsService from './PermissionsService';
import Author from '../../models/author';

/**
 * Logic-layer service for dealing with authors
 */

export default class AuthorService extends PermissionsService {
	/**
	 * Count authors
	 * @returns {number} count of authors
	 */
	count() {
		return Author.count();
	}
}
