const graphql = require('graphql')

// ES6 destructuring: retrieve and assign necessary properties from graphql
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql

// fixture data
const books = [
  { name: 'Some fantasy book', genre: 'Fantasy', id: '001' },
  { name: 'Some crime book', genre: 'Crime', id: '002' },
  { name: 'Some biography book', genre: 'Biography', id: '003' }
]

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
      // define that querying 'book' will return a GraphQLObject of BookType
      type: BookType,
      // define that a query for a book expects also the ID of the book as an argument
      args: { id: { type: GraphQLString } },
      // resolve function fires when the query is made
      resolve(parent, args) {
        /*
        NOTE: In this function it's possible to access a database or another external data source
        */

        return books.find(book => book.id === args.id) // data that is returned to the user
      }
    }
  }
})

// export which query a user can use from the frontend (schema)
module.exports = new GraphQLSchema({
  query: RootQuery
})