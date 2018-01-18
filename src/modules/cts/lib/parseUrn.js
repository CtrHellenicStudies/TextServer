const parsePassage = (passageValue) => {
	const resultPassage = [];
	const passage = passageValue.split('-');

	passage.forEach((delimiter) => {
		const location = [];
		delimiter.split('@').forEach((field) => {
			field.split('.').forEach((locationItem) => {
				if (!isNaN(parseInt(locationItem, 10))) {
					location.push(parseInt(locationItem, 10));
				} else {
					location.push(locationItem);
				}
			});
		});
		resultPassage.push(location);
	});

	return resultPassage;
};


const parseLiteralUrn = (ast) => {
	let result = null;
	let value;
	let ctsUrnParams = [];
	let textGroupAndWork = [];
	let textGroup = '';
	let work = '';

	switch (ast.kind) {
	case 'StringValue':
		value = ast.value;
		ctsUrnParams = value.split(':');

		if (ctsUrnParams.length) {
			result = {};

			if (ctsUrnParams.length > 4) {
				result.passage = parsePassage(ctsUrnParams[4]);
			}

			if (ctsUrnParams.length > 3) {
				textGroupAndWork = ctsUrnParams[3].split('.');
				textGroup = textGroupAndWork.shift();
				work = textGroupAndWork.join('.');
				result.textGroup = textGroup;
				result.work = work;
			}

			if (ctsUrnParams.length > 2) {
				result.ctsNamespace = ctsUrnParams[2];
			}
		}

		break;

	case 'ObjectValue':
		result = ast.value;
		break;

	case 'ArrayValue':
		if (ast.value.length === 3) {
			result = {};
			textGroupAndWork = ast.value[3].split('.');
			textGroup = textGroupAndWork.shift();
			work = textGroupAndWork.join('.');

			result.ctsNamespace = ast.value[2];
			result.textGroup = textGroup;
			result.work = work;
			result.passage = parsePassage(ast[4]);
		}
		break;

	default:
		result = null;
		break;
	}

	return result;
};

const parseValueUrn = (value) => {
	ctsUrnParams = value.split(':');

	if (ctsUrnParams.length) {
		result = {};

		if (ctsUrnParams.length > 4) {
			result.passage = ctsUrnParams[4].split('-');
		}

		if (ctsUrnParams.length > 3) {
			textGroupAndWork = ctsUrnParams[3].split('.');
			textGroup = textGroupAndWork.shift();
			work = textGroupAndWork.join('.');
			result.textGroup = textGroup;
			result.work = work;
		}

		if (ctsUrnParams.length > 2) {
			result.ctsNamespace = ctsUrnParams[2];
		}
	}
};

export { parseLiteralUrn, parseValueUrn };
export default parseLiteralUrn;
