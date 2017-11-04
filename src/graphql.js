import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { formatError } from 'apollo-errors';
import { GraphQLSchema, execute, subscribe } from 'graphql';
import { maskErrors } from 'graphql-errors';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

import { jwtAuthenticate } from './authentication';
import RootQuery from './graphql/queries/rootQuery';
import RootMutation from './graphql/mutations/rootMutation';

/**
 * Root schema
 * @type {GraphQLSchema}
 */
const RootSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation,
});

// mask error messages
maskErrors(RootSchema);

// Set user and project in context
const getGraphQLContext = req => ({
	user: req.user,
	project: req.project,
});

/**
 * Set up the graphQL HTTP endpoint
 * @param	{Object} app 	express app instance
 */
export default function setupGraphql(app) {
	app.use('/graphql', jwtAuthenticate, graphqlExpress(req => ({
		schema: RootSchema,
		context: getGraphQLContext(req),
		formatError,
	})));

	app.use('/graphiql', graphiqlExpress({
		endpointURL: '/graphql',
	}));
}
