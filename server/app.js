const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const creds = require('./creds')
const { DB_URL } = creds

const app = express()

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
  console.log('Connected to database')
})

// middleware
app.use('/api', graphqlHTTP({
  schema: schema, // import schema to middleware
  graphiql: true // loads graphiql testing interface at '/api'
}))

app.listen(4000, () => {
  console.log('Server listening on port 4000')
})