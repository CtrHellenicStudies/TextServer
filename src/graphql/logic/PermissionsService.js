export default class PermissionsService {
	constructor(props) {
		this.user = props.user ? props.user : null;

		this.userRolesForProject = [];
	}

	hasExamplePermission() {
		return true;
	}
}
