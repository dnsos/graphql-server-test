const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')

const app = express()

// middleware
app.use('/api', graphqlHTTP({
  schema: schema, // import schema to middleware
  graphiql: true // loads graphiql testing interface at '/api'
}))

app.listen(4000, () => {
  console.log('Server listening on port 4000')
})