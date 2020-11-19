const User = require("../../models/users");
const Event = require("../../models/events");
const { dateToString }  = require('../../helper/utils')

const transfromEvents = event =>{
    return {
      ...event._doc,
      date: dateToString(event._doc.date),
      creator: user.bind(this, event._doc.creator),
    };
}

const transfromBookings = booking =>{
    return {
      ...booking._doc,
      event:singleEvent.bind(this,booking._doc.event),
      user:user.bind(this,booking._doc.user),
      createdAt :dateToString(booking._doc.createdAt),
      updatedAt : dateToString(booking._doc.updatedAt),   
    }
  
}

const user = async (userId) => {
    try {
      const user = await User.findById(userId);
     // console.log(' user._doc.createdEvents', user._doc.createdEvents)
      return {
        ...user._doc,
        createdEvents: events.bind(this, user._doc.createdEvents),
      };
    } catch (err) {
      throw err;
    }
  };
  const events = async (eventIds) => {
    try {
      const events = await Event.find({ _id: { $in: eventIds } });
      return events.map((event) => {
        return transfromEvents(event)
      });
    } catch (err) {
      throw err;
    }
  };
  
  const singleEvent = async eventId => {
    try{
        const event = await Event.findOne({_id:eventId})
        return transfromEvents(event)
    }catch(err){
      throw err
    }
  }

  module.exports.transfromBookings = transfromBookings
  module.exports.transfromEvents = transfromEvents
