export default class PermissionsService {
	constructor(props) {
		this.user = props.user ? props.user : null;
		
		// TODO: verify token privileges if necessary

		this.userRolesForProject = [];
	}

	hasExamplePermission() {
		return true;
	}
}
