const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/monitor', {
  useNewUrlParser: true,
  useCreateIndex: true
});

const EnvCheck = require('./servers/EnvCheck')
new EnvCheck()

const HttpServer = require('./servers/HttpServer')
new HttpServer()

const WebSocket = require('./servers/WebsocketServer')
new WebSocket()