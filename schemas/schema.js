const graphql = require('graphql');
const _ = require('lodash');

// dummy data
const books = require('../dummyData/books');

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const BookType = new GraphQLObjectType({

	name: 'Book',
	fields: () => ({
		id: { type: GraphQLString },
		title: { type: GraphQLString }
	})

});

const RootQuery = new GraphQLObjectType({

	name:'RootQueryType',
	fields: {

		// must match the name of the query
		book: {
			type: BookType,

			// args is what tells where in the graph to look for the entry
			args: { id: { type: GraphQLString } },

			//
			resolve(parent, args) {
				// using lodash to filter books
				return _.find( books, { id: args.id } );
			}
		}
	}

})

module.exports = new GraphQLSchema({
	query: RootQuery
})

// todo: split this code