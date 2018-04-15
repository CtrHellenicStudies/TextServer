const parsePassageLocation = (passageLocation) => {
	let passageString = '';
	passageLocation.forEach((locationItem) => {
		if (isNaN(parseInt(locationItem, 10))) {
			passageString += `@${locationItem}`;
		} else {
			passageString += `.${locationItem}`;
		}
	});
	if (passageString[0] === '.') {
		passageString = passageString.substring(1);
	}
	return passageString;
};

const parsePassage = (passageItemList) => {
	let parsedPassageString = '';
	passageItemList.forEach((passageItem, i) => {
		if (i !== 0) {
			parsedPassageString = `${parsedPassageString}-`;
		}
		parsedPassageString = `${parsedPassageString}${parsePassageLocation(passageItem)}`;
	});
	return parsedPassageString;
};


export default parsePassage;
