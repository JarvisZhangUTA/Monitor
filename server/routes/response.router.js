const config = require('../config')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const express = require('express')
const router = express.Router()

const AuthService = require('../services/AuthService')
const authService = new AuthService()

const UserService = require('../services/UserService')
const userService = new UserService()

const AuthMiddleware = require('../middlewares/auth.middleware')
const userLimit = AuthMiddleware.userLimit

const ResponseServie = require('../services/ResponseService')
const responseService = new ResponseServie()

router.get('/', userLimit, async function (req, res) {
  const decoded = authService.verifyToken(req.headers['x-token'])
  const user = await userService.getUserById(decoded._id)
  const monitorIds = user.monitors

  if (req.query.monitor_ids) {
    if (!Array.isArray(req.query.monitor_ids)) {
      req.query.monitor_ids = req.query.monitor_ids.split(',')
    }

    if (user.role !== 'admin') {
      for (let i = 0; i < req.query.monitor_ids.length; i++) {
        if (monitorIds.indexOf(req.query.monitor_ids[i]) === -1) {
          req.query.monitor_ids.splice(i, 1)
          i--
        }
      }
    }
  }

  const responses = await responseService.getResponses(req.query)
  res.json(responses)
})

module.exports = router