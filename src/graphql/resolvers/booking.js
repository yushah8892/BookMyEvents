const Event = require("../../models/events");
const Booking = require('../../models/booking')
const {transfromBookings,transfromEvents} = require('./merge') 


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
    
  }
};
