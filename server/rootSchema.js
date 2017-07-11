import { GraphQLSchema } from 'graphql';

import RootQuery from './queries/rootQuery';
// import RootMutation from './mutations/rootMutation';


const RootSchema = new GraphQLSchema({
	query: RootQuery,
	// mutation: RootMutation,
});

export default RootSchema;
