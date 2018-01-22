const serializeUrn = (value) => {

	if (!value) {
		return '';
	}

	let result = 'urn:cts';

	if ('ctsNamespace' in value && value.ctsNamespace && value.ctsNamespace.length) {
		result = `${result}:${value.ctsNamespace}`;
	} else {
		return result;
	}

	if ('textGroup' in value && value.textGroup && value.textGroup.length) {
		result = `${result}:${value.textGroup}`;
	} else {
		return result;
	}

	if ('work' in value && value.work && value.work.length) {
		result = `${result}.${value.work}`;
	} else {
		return result;
	}

	if ('passage' in value && value.passage && value.passage.length) {
		result = `${result}:`;
		value.passage.forEach((passage, i) => {
			if (i !== 0) {
				result = `${result}-`;
			}
			result = `${result}${passage.join('.')}`;
		});
	}

	return result;
};


export default serializeUrn;
