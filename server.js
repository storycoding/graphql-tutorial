const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// imports our schema
const schema = require('./schemas/schema');

let app = express();

// use the graphql endpoint for all graphql queries
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));


app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');