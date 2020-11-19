const Event = require("../../models/events");
const User = require("../../models/users");
const { dateToString }  = require('../../helper/utils')
const {transfromEvents} = require('./merge') 

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transfromEvents(event)
      });
    } catch (err) {
      throw err;
    }
  },
  createEvents: async (arg,req) => {
    if(!req.isAuth){
      throw new Error('Unauthenticated.')
    }
    try {
      let createdEvents;
      const event = new Event({
        title: arg.eventInput.title,
        description: arg.eventInput.description,
        price: +arg.eventInput.price,
        date: dateToString(arg.eventInput.date),
        creator: req.userId,
      });
      const result = await event.save();
      createdEvents = {
        ...result._doc,
        date: dateToString(result._doc.date),
      };
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("User Not Exists.");
      }
      user.createdEvents.push(event);
      await user.save();
      return { ...createdEvents, creator: user._doc };
    } catch (err) {
      throw err;
    }
  }
};
