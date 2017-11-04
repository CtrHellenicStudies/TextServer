import { GraphQLScalarType } from 'graphql';

/**
 * Custom graphql scalar type representing a CTS URN as individual input components
 */
const CtsUrn = new GraphQLScalarType({
	name: 'CtsUrn',
	description: 'GraphQL custom scalar type to represent a CTS URN',
	serialize(value) {
	 let result;
	 // Implement your own behavior here by setting the 'result' variable
	 return result;
	},
	parseValue(value) {
	 let result;
	 // Implement your own behavior here by setting the 'result' variable
	 return result;
	},
	parseLiteral(ast) {
	 switch (ast.kind) {
		 // Implement your own behavior here by returning what suits your needs
		 // depending on ast.kind
	 }
	}
});


export default CtsUrn;
