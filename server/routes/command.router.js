const config = require('../config')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const express = require('express')
const router = express.Router()

const AuthService = require('../services/AuthService')
const authService = new AuthService()

const CommandService = require('../services/CommandService')
const commandService = new CommandService()

const AuthMiddleware = require('../middlewares/auth.middleware')
const userLimit = AuthMiddleware.userLimit

router.get('/', async function (req, res) {
  let user_id = req.query.user_id
  if (!user_id || +user_id === -1) {
    user_id = -1
  } else {
    let token = req.headers['x-token']
    if (!token) {
      return res.status(404).send('Token required')
    }
    let decoded = authService.verifyToken(token)
    if (!decoded) {
      return res.status(404).send('Verify Fail')
    }
    if (decoded._id !== user_id && decoded.role !== 'admin') {
      return res.status(404).send('Verify Fail')
    }
  }

  let commands = await commandService.getCommandsByUserId(user_id)
  res.json(commands)
})

router.post('/', jsonParser, userLimit, function (req, res, next) {
  if (!req.body) {
    return res.status(404).send('No Data')  
  }

  let user = authService.verifyToken(req.headers['x-token'])

  if (!req.body.user_id) {
    req.body.user_id = user._id
  }

  if (req.body.user_id === -1 && user.role !== 'admin') {
    req.body.user_id = user._id
  }

  next()
}, async function (req, res) {
  let command = await commandService.createCommand(req.body)
  res.json(command)
})

router.delete('/:id', userLimit, async function (req, res) {
  let user = authService.verifyToken(req.headers['x-token'])
  let command = await commandService.getCommandById(req.params.id)

  if (!command) {
    return res.status(404).send('Command not found')
  }

  if (command.user_id !== user._id && user.role !== 'admin') {
    return res.status(404).send('You dont have authorization to change this')
  }

  let deleted = await commandService.deleteCommand(req.params.id)
  res.json(deleted)
})

module.exports = router