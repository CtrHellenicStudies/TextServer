export default class PermissionsService {
	constructor(props) {
		this.user;

		// TODO: verify token privileges if necessary

		this.userRolesForProject = [];
	}

	hasExamplePermission() {
		return true;
	}
}
