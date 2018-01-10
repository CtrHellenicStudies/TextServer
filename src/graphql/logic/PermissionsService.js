export default class PermissionsService {
	constructor(props) {
		this.user = null;

		// TODO: verify token privileges if necessary

		this.userRolesForProject = [];
	}

	hasExamplePermission() {
		return true;
	}
}
