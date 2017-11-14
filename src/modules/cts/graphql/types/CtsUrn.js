import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';


/**
 * Custom graphql scalar type representing a CTS URN as individual input components
 */
const CtsUrn = new GraphQLScalarType({
	name: 'CtsUrn',
	description: 'GraphQL custom scalar type to represent a CTS URN',
	parseValue(value) {
	 let result = {
		 ctsNamespace: null,
		 work: null,
		 passage: null,
	 };

	 let ctsUrnParams = value.split(':');

	 if (ctsUrnParms.length) {
		 result.ctsNamespace = ctsUrnParms[2];
		 result.work = ctsUrnParams[3].split('.');
		 result.passage = ctsUrnParams[4].split('-');
	 }

	 return result;
	},
	serialize(value) {
	 let result = `urn:cts:${value.ctsNamespace}:${value.work.join('.')}:${value.passage.join('-')}`;

	 return result;
	},
	parseLiteral(ast) {
		let result = ''

		switch (ast.kind) {
		case Kind.STRING:
			let value = ast.value;
			result = `urn:cts:${value.ctsNamespace}:${value.work.join('.')}:${value.passage.join('-')}`;
			break;
		default:
			result = null;
			break;
		}

		return result;
	},
});


export default CtsUrn;
