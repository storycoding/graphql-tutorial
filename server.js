const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

// imports our schema
const schema = require('./schemas/schema');

let app = express();

mongoose.connect(
	`mongodb://${process.env.MLAB_USER}:${process.env.MLAB_PASSWORD}@ds113442.mlab.com:13442/gql-tutorial`,
	{ useNewUrlParser: true }
)
.then( (connection) => {
	const host = connection.connections[0].host;
	const port = connection.connections[0].port;
	const user = connection.connections[0].user;
	console.log(`connected to MongoBD host ${host} on port ${port} as ${user}`)
})
.catch( (error) => console.error('database error: ', error) )

mongoose.connection.once('open', () => {
	console.log('connected to the mlab database');
})

// use the graphql endpoint for all graphql queries
app.use('/graphql', graphqlHTTP({
  schema, // different from the mongoDB schema, this is the graph that connects it
  graphiql: true
}));


app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');