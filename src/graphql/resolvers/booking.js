const Event = require("../../models/events");
const Booking = require('../../models/booking')
const {transfromBookings,transfromEvents} = require('./merge') 
var mongoose = require('mongoose');


module.exports = {
  bookings : async (args,req) => {
    if(!req.isAuth){
      throw new Error('Unauthenticated.')
    }
      const bookings = await Booking.find()
      return bookings.map( booking =>{
        return transfromBookings(booking)
      }) 
  },
  bookEvent :async (args,req) =>{
    if(!req.isAuth){
      throw new Error('Unauthenticated.')
    }
    try{
      const fetchedEvent = await Event.findOne({_id:args.eventId})
      const booking = new Booking({
        event:fetchedEvent,
        user: req.userId
      })
      const result = await booking.save()
      return transfromBookings(result)
    }catch(err){
      throw err
    }
    

  },
  cancelBooking :async  (args,req) =>{
    if(!req.isAuth){
      throw new Error('Unauthenticated.')
    }
    try{
      const booking = await Booking.findById(args.bookingId).populate('event')
      const event = transfromEvents(booking.event) 
      await Booking.findByIdAndDelete(args.bookingId)
      return event
    }catch(err){
      throw err
    }
    
  },
  userBookings : async (args,req) =>{
    if(!req.isAuth){
      throw new Error('Unauthenticated.')
    }
  //  req.userId = mongoose.Types.ObjectId("5fb92dfa2758b30c4b63fba1")
    try{
      const bookings = await Booking.find({user:req.userId}).populate('event')
       return bookings
    }catch(err){
      throw err
    }
  }
};
