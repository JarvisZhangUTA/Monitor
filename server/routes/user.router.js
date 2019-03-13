const config = require('../config')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const express = require('express')
const router = express.Router()

const UserService = require('../services/UserService')
const userService = new UserService()

const AuthService = require('../services/AuthService')
const authService = new AuthService()

const AuthMiddleware = require('../middlewares/auth.middleware')
const adminLimit = AuthMiddleware.adminLimit

router.get('/', adminLimit, async function (req, res) {
  let users = await userService.getUserList(req.query)
  res.json(users)
})

router.put('/:_id', jsonParser, function (req, res, next) {
  if (!req.headers['x-token']) {
    return res.status(404).send('Token required')
  }

  const token = req.headers['x-token']
  const verify = authService.verifyToken(token)

  if (!verify) {
    return res.status(404).send('Verify fail')
  }

  if (verify.role !== 'admin' && verify._id !== req.params._id) {
    return res.status(404),send('You dont have authorization to change this')
  }

  if (req.body._id && req.body._id !== req.params._id) {
    return res.status(404).send('Data and id not match')
  }

  next()
}, async function (req, res) {
  let user = await userService.updateUser(req.body)
  res.json(user)
})

/** SIGN UP */
router.post('/signup', jsonParser, function (req, res, next) {
  let params = req.body;

  if (!params.email) {
    return res.status(404).send('Email required')
  }

  if (!params.password) {
    return res.status(404).send('Password required')
  }

  next()
}, async function (req, res) {
  let params = req.body
  let user = await userService.getUserByEmail(params.email)

  if (user) {
    return res.status(404).send('Email exists')
  }

  user = await userService.createUser(params)
  user.token = authService.signToken(user)

  res.json(user)
})

/** SIGN IN */
router.post('/signin', jsonParser, function (req, res, next) {
  let params = req.body
  
  if (!params.email) {
    return res.status(404).send('Email required')
  }

  if (!params.password) {
    return res.status(404).send('Password Required')
  }

  next()
}, async function (req, res) {
  let params = req.body
  let user = await userService.getUserByEmailAndPassword(params.email, params.password)

  if (!user) {
    return res.status(404).send('User not found')
  }

  user.token = authService.signToken(user)

  res.json(user)
})

/** INFO */
router.post('/info', jsonParser, function (req, res, next) {
  if (!req.body.token) {
    return res.status(404).send('Token required')
  }

  next()
}, async function (req, res) {
  const token = req.body.token
  const verify = authService.verifyToken(token)

  if (!verify) {
    return res.status(404).send('Verify fail')
  }

  const user = await userService.getUserByEmail(verify.email)

  if (!user) {
    return res.status(404).send('User not found')
  }

  res.json(user)
})

module.exports = router