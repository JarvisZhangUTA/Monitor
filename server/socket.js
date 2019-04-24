const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/monitor', {
  useNewUrlParser: true,
  useCreateIndex: true
});

const WebSocket = require('./servers/WebsocketServer')
new WebSocket()