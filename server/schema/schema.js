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
    GraphQLList,
    GraphQLNonNull
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

        // findById() is a MonoDB function
        return Author.findById(parent.authorID) // return author of this book
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
        // find() is a MongoDB function
        return Book.find({ authorID: parent.id }) // returns all books by this author
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

        return Book.findById(args.id) // return specific book
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return specific author
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        // empty object in find() returns all content of Book
        return Book.find({})
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve() {
        // empty object in find() returns all content of Author
        return Author.find({})
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
        name: { type: new GraphQLNonNull(GraphQLString) }, // NonNull ensures that field is present in mutation
        age: { type: new GraphQLNonNull(GraphQLInt) }
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
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorID: { type: new GraphQLNonNull(GraphQLID) }
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