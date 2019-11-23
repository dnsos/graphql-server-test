const graphql = require('graphql')

// ES6 destructuring: retrieve and assign necessary properties from graphql
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql

// define what a 'Book' should look like
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
})

// RootQuery defines how the frontend can 'jump into' the graph
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType, // define that querying 'book' will return a GraphQLObject of BookType
      args: { id: { type: GraphQLString } }, // define that a query for a book expects also the ID of the book as an argument
      resolve(parent, args) {
        // here data from a database or other source can be retrieved
        args.id
      }
    }
  }
})

// export which query a user can use from the frontend (schema)
module.exports = new GraphQLSchema({
  query: RootQuery
})