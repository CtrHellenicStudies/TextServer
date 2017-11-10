import PermissionsService from './PermissionsService';
import TextGroup from '../../models/textGroup';

/**
 * Logic-layer service for dealing with textGroups
 */
export default class TextGroupService extends PermissionsService {

	/**
	 * Count text groups
	 * @returns {number} count of text groups
	 */
	count() {
		return TextGroup.count();
	}
}
