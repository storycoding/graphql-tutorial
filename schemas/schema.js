const graphql = require('graphql');

const Book = require('../models/book');
const Author = require('../models/author');

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

	// fields needs to be wrapped in a function (avoids undefined obj props)
	fields: () => ({
		id: { type: GraphQLID },
		title: { type: GraphQLString },
		author: {
			type: AuthorType,
			// one-one relationship ( findById )
			resolve: (parent, args) => Author.findById(parent.authorId)
		}
	})
});

const AuthorType = new GraphQLObjectType({

	name: 'Author',

	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			// one-many relationship ( find )
			resolve: (parent) => Book.find({ authorId: parent.id })
		}
	})
});

const RootQuery = new GraphQLObjectType({

	name:'RootQueryType',
	fields: {
		// prop key must match the name of the query
		author: {
			type: AuthorType,
			// args is what tells where in the graph to look for the entry
			args: { id: { type: GraphQLID } },
			// using lodash to filter by id
			resolve: (parent, args) => Author.findById(args.id)
		},
		book: {
			type: BookType,
			args: { id: { type: GraphQLID } },
			resolve: (parent, args) => Book.findById(args.id)
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve: () => Author.find({})
			// resolve doesn't need any args to specify results
		},
		books: {
			type: new GraphQLList(BookType),
			resolve: () => Book.find({})
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				age: { type: GraphQLInt },
				name: { type: GraphQLString }
			},
			resolve: (parent, args) => {
				// using mongoose's author model to instantiate an author
				let author = new Author({
					age: args.age,
					name: args.name
				});
				// add return to get the saved entry
				return author.save(); // saves the author to the db :o
			}
		},
		addBook: {
			type: BookType,
			args: {
				authorId: { type: GraphQLID },
				title: { type: GraphQLString }
			},
			resolve: (parent, args) => {
				let book = new Book({
					authorId: args.authorId,
					title: args.title
				});
				return book.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})