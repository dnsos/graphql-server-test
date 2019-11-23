const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')

const app = express()

app.use('/api', graphqlHTTP({
  schema: schema // import schema to middleware
}))

app.listen(4000, () => {
  console.log('Server listening on port 4000')
})