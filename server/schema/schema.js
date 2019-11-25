const graphql = require('graphql')

// importing the MongoDB models
const Book = require('../models/book')
const Author = require('../models/author')

// ES6 destructuring: retrieve and assign necessary properties from graphql
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList
} = graphql

// define what a 'Book' should look like
const BookType = new GraphQLObjectType({
  name: 'Book',
  // 'field' needs to be a function to first initialise BookType and AuthorType before accessing each
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) { // parent references the Book type
        /* return authors.find(author => author.id === parent.authorID) */
      }
    }
  })
})

// define what an 'Author' should look like
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  // 'field' needs to be a function to first initialise BookType and AuthorType before accessing each
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType), // access a list of books
      resolve(parent, args) { // parent references the Author type
        /* return books.filter(book => book.authorID === parent.id) */
      }
    }
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
      args: { id: { type: GraphQLID } },

      // resolve function fires when the query is made
      resolve(parent, args) {
        /*
        NOTE: In this function it's possible to access a database or another external data source
        */

        /* return books.find(book => book.id === args.id) */ // data that is returned to the user
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        /* return authors.find(author => author.id == args.id) */
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        /* return books */ // simply return 'books' array
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve() {
        /* return authors */ // simply return 'authors' array
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        // accesses imported MongoDB model
        let author = new Author({
          name: args.name,
          age: args.age
        })

        return author.save() // saves instance to database with mongoose
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorID: { type: GraphQLID }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorID: args.authorID
        })

        return book.save()
      }
    }
  }
})

// export which query a user can use from the frontend (schema)
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})