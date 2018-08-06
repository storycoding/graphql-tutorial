const graphql = require('graphql');
const _ = require('lodash');

// dummy data
const books = require('../dummyData/books');
const authors = require('../dummyData/authors');

const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
	GraphQLSchema,
	GraphQLID // for automatic conversion of int / string queries
} = graphql;

const BookType = new GraphQLObjectType({

	name: 'Book',

	// fields needs to be wrapped in a function
	// because it tries to source a type (object) that is not yet defined
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		author: {
			type: AuthorType,

			// this is where the graph in graphQL works its magic
			// one-one relationship
			resolve: (parent, args) => _.find( authors, { id: parent.authorId } )
		}
	})
	// fields is only executed after the whole code is run, so the dual dependecy injection works

});

const AuthorType = new GraphQLObjectType({

	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			// one-many relationship : the GraphQLList
			type: new GraphQLList(BookType),
			// use _.filter instead, to return all matching entries from list
			resolve: (parent, args) => _.filter( books, { authorId: parent.id } )
		}
	})

})

const RootQuery = new GraphQLObjectType({

	name:'RootQueryType',
	fields: {

		// must match the name of the query
		book: {
			type: BookType,
			// args is what tells where in the graph to look for the entry
			args: { id: { type: GraphQLID } },
			// using lodash to filter by id
			resolve: (parent, args) => _.find( books, { id: args.id } )
		},
		author: {
			type: AuthorType,
			args: { id: { type: GraphQLID} },
			resolve: (parent, args) => _.find( authors, { id: args.id } )
		}
	}

})

module.exports = new GraphQLSchema({
	query: RootQuery
})