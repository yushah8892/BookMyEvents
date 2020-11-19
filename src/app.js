const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const mongoose = require('mongoose')

const app =  express()
const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')
//app.use(bodyParser)

app.use(isAuth)
app.use('/graphql',graphqlHTTP({
    schema: graphQlSchema,
    rootValue:graphQlResolvers,
    graphiql : true
}))
mongoose.connect(`mongodb+srv://user:mongodb@cluster0.dpm4u.mongodb.net/bookmyevents?retryWrites=true&w=majority`)
.then(()=>{
    app.listen('3000',()=> console.log(`app is listening on 3000`))
}).catch(console.log)

