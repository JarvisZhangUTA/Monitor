const jwt = require('jsonwebtoken')
const config = require('../config')

class AuthService {
  verifyToken (token) {
    return jwt.verify(token, config.jwt_secret)
  }

  signToken (user) {
    if (!user) {
      return null
    }

    return jwt.sign(user, config.jwt_secret)
  }
}

module.exports = AuthService