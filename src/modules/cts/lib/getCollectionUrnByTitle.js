/**
 * getCollectionUrnByTitle
 * A simple workaround for inferring collection URN from title
 */

const getCollectionUrnByTitle = (title) => {
	let urn = null;

	switch (title) {
	case 'The First Thousand Years of Greek':
		urn = 'urn:cts:greekLit';
		break;
	case 'Canonical Greek Literature':
		urn = 'urn:cts:greekLit';
		break;
	case 'Canonical Latin Literature':
		urn = 'urn:cts:latinLit';
		break;
	case 'Corpus Scriptorum Ecclesiasticorum Latinorum':
		urn = 'urn:cts:latinLit';
		break;
	case 'The Center for Hellenic Studies Greek Texts':
		urn = 'urn:cts:latinLit';
		break;
	default:
		urn = null;
		break;
	}

	return urn;
};

export default getCollectionUrnByTitle;
