import parsePassage from '../lib/parsePassage';

describe('LightWeightCTS Lib Tests ...', () => {

	it('should parse CTS passage location structure to string correctly', async () => {
		// SETUP
		const passageDotCitationAt = [[1, 1, 'θεὰ'], [1, 12, 'γὰρ']];
		const expectedPassageStringDotCitationAt = '1.1@θεὰ-1.12@γὰρ';
		const passageDotCitation = [[1, 1], [1, 12]];
		const expectedPassageStringDotCitation = '1.1-1.12';
		const passageCitationAt = [[1, 'θεὰ'], [12, 'γὰρ']];
		const expectedPassageStringCitationAt = '1@θεὰ-12@γὰρ';

		// RUN
		const actualPassageStringDotCitationAt = parsePassage(passageDotCitationAt);
		const actualPassageStringDotCitation = parsePassage(passageDotCitation);
		const actualPassageStringCitationAt = parsePassage(passageCitationAt);

		// CHECK
		expect(actualPassageStringDotCitationAt).toEqual(expectedPassageStringDotCitationAt);
		expect(actualPassageStringDotCitation).toEqual(expectedPassageStringDotCitation);
		expect(actualPassageStringCitationAt).toEqual(expectedPassageStringCitationAt);
	});

});
