const graphql = require('graphql')

// ES6 destructuring: retrieve and assign GraphQLObjectType function from graphql
const { GraphQLObjectType, GraphQLString } = graphql

// define what a 'Book' should look like
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
})