import PermissionsService from './PermissionsService';
import Language from '../../models/language';

/**
 * Logic-layer service for dealing with languages
 */

export default class LanguageService extends PermissionsService {
	getLanguage(id) {
		return Language.findOne({
			where: {
				id,
			},
		});
	}

	/**
	 * Count languages
	 * @returns {number} count of languages
	 */
	count() {
		return Language.count();
	}
}
