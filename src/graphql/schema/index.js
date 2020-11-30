const {buildSchema} = require('graphql')

module.exports = buildSchema(`
type Booking {
    _id : ID!
    event : Event!
    user : User!
    createdAt : String!
    updatedAt : String!
}

type User {
    _id : ID!
    firstName:String!
    lastName:String!
    email : String!
    password: String
    createdEvents : [Event!]
}
type Event {
    _id : ID!
    title : String!
    description : String!
    price : Float!
    date : String!
    creator: User!
}
type AuthData{
    userId : ID!
    token : String!
    tokenExpiration :Int !
    user: User!
}

input UserInput {
    firstName:String!
    lastName:String!
    email:String!
    password:String!
}
input EventInput {
    title : String!
    description : String!
    price : Float!
    date : String!
}
type RootQuery {
    events : [Event!]!
    bookings : [Booking!]!
    userBookings : [Booking!]!
}
type RootMutations {
    createEvents(eventInput :EventInput):Event 
    createUsers(userInput:UserInput) : User
    bookEvent(eventId : ID) : Booking!
    cancelBooking(bookingId: ID) : Event!
    login(email : String!,password : String!): AuthData!

}    

schema {
    query: RootQuery
    mutation: RootMutations
}
`)