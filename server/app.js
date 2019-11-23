const express = require('express')
const graphqlHTTP = require('express-graphql')

const app = express()

app.use('/api', graphqlHTTP({

}))

app.listen(4000, () => {
  console.log('Server listening on port 4000')
})