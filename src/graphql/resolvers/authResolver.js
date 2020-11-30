const User = require("../../models/users");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

module.exports = {
  createUsers: async (args) => {
    let hashedPasswd;
    try {
      const user = await User.findOne({ email: args.userInput.email });
      if (user) {
        throw new Error("User Exists Already");
      } else {
        hashedPasswd = await bcrypt.hash(args.userInput.password, 12);
      }
      const userModel = new User({
        firstName: args.userInput.firstName,
        lastName:args.userInput.lastName,
        email: args.userInput.email,
        password: hashedPasswd,
      });
      const result = await userModel.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login : async ({email,password}) => {
        const user = await User.findOne({email:email})
        if(!user){
            throw new Error('User doesn not exist.')
        }
        const isEqual = await bcrypt.compare(password,user.password)
        if(!isEqual){
            throw new Error('Invalid Credentials.')
        }
        const token = jwt.sign({userId:user.id,email:user.email},'1234567890',{
            expiresIn:'1h'
        })
        const resUser = user._doc
        resUser.password = null
        return {
            user:resUser,
            userId: user.id,
            token : token,
            tokenExpiration:1
        }


  }
};
