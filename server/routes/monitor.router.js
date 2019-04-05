const config = require('../config')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const express = require('express')
const router = express.Router()

const AuthService = require('../services/AuthService')
const authService = new AuthService()

const MonitorServie = require('../services/MonitorService')
const monitorService = new MonitorServie()

const AuthMiddleware = require('../middlewares/auth.middleware')
const adminLimit = AuthMiddleware.adminLimit
const userLimit = AuthMiddleware.userLimit

const UserService = require('../services/UserService')
const userService = new UserService()

const UtilService = require('../services/UtilService')

router.get('/all', adminLimit, async function (req, res) {
  let monitors = await monitorService.getMonitorList(req.query)
  res.json(monitors)
})

router.get('/', userLimit, async function (req, res) {
  const decoded = authService.verifyToken(req.headers['x-token'])
  const user = await userService.getUserById(decoded._id)
  const monitorIds = user.monitors
  if (!monitorIds || monitorIds.length === 0) {
    return res.json([])
  }

  req.query.ids = req.query.ids ? req.query.ids.filter(v => monitorIds.includes(v)) : monitorIds

  const monitors = await monitorService.getMonitorList(req.query)
  res.json(monitors)
})

router.put('/:monitor_id', jsonParser, async function (req, res, next) {
  if (!req.headers['x-token']) {
    return res.status(404).send('Token required')
  }

  const id = req.params.monitor_id
  const token = req.headers['x-token']
  const verify = authService.verifyToken(token)
  
  if (!id) {
    return res.status(404).send('ID Required')
  }

  if (!verify) {
    return res.status(404).send('Verify fail')
  }

  if (verify.role === 'admin') {
    return next()
  }

  const user = await userService.getUserByEmail(verify.email)
  if (!user.monitors || user.monitors.indexOf(id) === -1) {
    return res.status(404).send('Verify fail')
  }

  return next()
}, async function (req, res) {

  let params = req.body

  params.monitor_id = req.params.monitor_id

  delete params.mac
  delete params.secret

  let monitor = await monitorService.updateMonitor(params)
  res.json(monitor)
})

router.post('/unlink', jsonParser, userLimit, function (req, res, next) {
  let params = req.body;

  if (!params.monitor_id) {
    return res.status(404).send('ID Required')
  }

  next()
}, async function (req, res) {
  const decoded = authService.verifyToken(req.headers['x-token'])
  const user = await userService.getUserById(decoded._id)

  if (!user.monitors) {
    user.monitors = []
  }

  const index = user.monitors.indexOf(req.body.monitor_id)
  if (index !== -1) {
    user.monitors.splice(index, 1)
    await userService.updateUser(user)
  }

  res.send('Monitor unlinked')
})

router.post('/link', jsonParser, userLimit, function (req, res, next) {
  let params = req.body;

  if (!params.monitor_id) {
    return res.status(404).send('ID Required')
  }

  if (!params.secret) {
    return res.status(404).send('Secret Required')
  }
  
  next()
}, async function (req, res) {
  const monitor = await monitorService.getMonitorByIdAndSecret(req.body.monitor_id, req.body.secret)
  
  if (!monitor) {
    return res.status(404).send('Monitor not found')
  }

  const decoded = authService.verifyToken(req.headers['x-token'])
  const user = await userService.getUserById(decoded._id)
  
  if (!user.monitors) {
    user.monitors = []
  }

  user.monitors.push(monitor.monitor_id)
  await userService.updateUser(user)

  res.json(monitor)
})

router.post('/', jsonParser, adminLimit, function (req, res, next) {
  let params = req.body;

  if (!params.monitor_id) {
    return res.status(404).send('ID Required')
  }

  if (!params.mac) {
    return res.status(404).send('MAC Required')
  }
  
  next()
}, async function (req, res) {
  let params = req.body
  params.secret = UtilService.makeID(8)

  let monitor = null

  monitor = await monitorService.getMonitorById(params.monitor_id)
  if (monitor) {
    return res.status(404).send('ID exists')
  }

  monitor = await monitorService.getMonitorByMac(params.mac)
  if (monitor) {
    return res.status(404).send('MAC exists')
  }

  monitor = await monitorService.createMonitor(params)
  res.json(monitor)
})

router.delete('/:id', adminLimit, async function (req, res) {
  let monitor = await monitorService.getMonitorById(req.params.id)

  if (!monitor) {
    return res.status(404).send('Monitor not found')
  }

  let deleted = await monitorService.deleteMonitor(req.params.id)
  res.json(deleted)
})

module.exports = router