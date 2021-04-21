const redisClient = require('./handleSignIn').redisClient

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json('Unauthorized')
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized')
    }
    console.log('access success!')
    return next()
  })
}

module.exports = {
  requireAuth
}