const AuthService = require('../services/AuthService')
const authService = new AuthService()

const adminLimit = function (req, res, next) {
  if (!req.headers['x-token']) {
    return res.status(404).send('Unauthentication')
  }

  const token = req.headers['x-token']
  const decoded = authService.verifyToken(token)

  if (!decoded) {
    return res.status(404).send('Unauthentication')
  }

  if (decoded.role !== 'admin') {
    return res.status(404).send('Unauthentication')
  }

  next()
}

const userLimit = function (req, res, next) {

}

module.exports = {
  adminLimit,
  userLimit
}