import PermissionsService from './PermissionsService';
import Collection from '../../models/collection';

/**
 * Logic-layer service for dealing with collections
 */

export default class CollectionService extends PermissionsService {
	/**
	 * Count collections
	 * @returns {number} count of collections
	 */
	count() {
		return Collection.count();
	}
}
