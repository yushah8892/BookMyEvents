const eventResolver = require('./events')
const bookingResolver = require('./booking')
const authResolver = require('./authResolver')

const rootResolver = {
  ...eventResolver,
  ...bookingResolver,
  ...authResolver
}

module.exports = rootResolver