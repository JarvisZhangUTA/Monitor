const express = require('express')
const path = require('path')
const app = express()
const http = require('http')
const config = require('../config')

const CommandRouter = require('../routes/command.router')
const MonitorRouter = require('../routes/monitor.router')
const ResponseRouter = require('../routes/response.router')
const UserRouter = require('../routes/user.router')

class HttpServer {
  constructor () {
    app.use(express.static(path.join(__dirname,'../../web-client/dist')))

    app.use('/api/commands', CommandRouter)
    app.use('/api/monitors', MonitorRouter)
    app.use('/api/responses', ResponseRouter)
    app.use('/api/users', UserRouter)

    app.use(function (req, res, next) {
      res.sendFile('index.html', {root: path.join(__dirname, '../../web-client/dist')});
    })

    http.createServer(app).listen(config.http_port, () => {
      console.log(`HTTP Server listening on port ${config.http_port}`)
    })
  }
}

module.exports = HttpServer