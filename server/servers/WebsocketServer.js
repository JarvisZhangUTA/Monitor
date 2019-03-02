const WebSocket = require('ws')

const config = require('../config')

const AuthService = require('../services/AuthService')
const UserService = require('../services/UserService')
const MonitorService = require('../services/MonitorService')
const ResponseService = require('../services/ResponseService')

class WebsocketServer {
  constructor () {
    console.log(`Websocket Server listening on port ${config.websocket_port}`)

    /** Initial Environment */
    this.userConnections = []
    this.monitorConnections = []

    /** Initial Websocket */
    let service = this
    this.websocket = new WebSocket.Server({ port: config.websocket_port })
    
    this.websocket.on('connection', (ws, req) => {
      ws.on('message', (message) => {
        service.onMessage(ws, message)
      })

      ws.on('close', () => {
        service.onClose(ws)
      })
    })

    /** Other Service */
    this.authService = new AuthService()
    this.userService = new UserService()
    this.monitorService = new MonitorService()
    this.responseService = new ResponseService()
  }

  onMessage (ws, message) {
    message = this.parseMessage(message)

    switch (ws.verify) {
      case 'user':
        this.onUserMessage(ws, message)
        break
      case 'monitor':
        this.onMonitorMessage(ws, message)
        break
      default:
        this.onVerifyMessage(ws, message)
        break
    }
  }

  onClose (ws) {

    let index = -1

    index = this.userConnections.indexOf(ws)
    if (index > -1) {
      this.userConnections.splice(index, 1)
    }

    index = this.monitorConnections.indexOf(ws)
    if (index > -1) {
      this.monitorConnections.splice(index, 1)
    }
  }

  sendMessage(to, message) {
    if( Array.isArray(to) ) {
      to.forEach(item => {
          item.send(JSON.stringify( message ));
      })
    } else {
      to.send(JSON.stringify( message ));
    }
  }

  parseMessage( message ) {
    try {
      message = JSON.parse(message);
      return message;
    } catch ( e ) {
      console.error(e);
    }
    return null;
  }

  /**
   *  { type: 'command', send_to: monitor_id, command: command }
   *  { type: 'monitors' }
   */
  onUserMessage (ws, message) {
    switch (message.type) {
      case 'command':
        if (ws.user.monitors.indexOf(message.send_to) === -1) {
          this.sendMessage(ws, {type: 'error', data: 'You dont have permission to send this command'})
          return
        }
        
        let monitorConnection = this.monitorConnections.find(item => {
          return item.monitor && item.monitor.monitor_id === message.send_to
        })

        if (!monitorConnection) {
          this.sendMessage(ws, {type: 'error', data: 'Selected monitor is offline'})
          return
        }

        this.sendMessage(monitorConnection, message)
        break;
      case 'monitors':
        let subscribes = ws.user.monitors
        let onlines = []
        this.monitorConnections.forEach(monitorConnection => {
          let monitor = monitorConnection.monitor
          if (subscribes.indexOf(monitor.monitor_id) > -1) {
            onlines.push(monitor)
          }
        })

        this.sendMessage(ws, {type: 'monitors', data: onlines})
        break; 
    }
  }
  
  /**
   * { type: 'response', response: response }
   */
  onMonitorMessage (ws, message) {
    switch (message.type) {
      case 'response':
        let response = message.response
        response.monitor_id = ws.monitor.monitor_id
        this.responseService.saveResponse(response)
        break;
    }
  }

  async onVerifyMessage (ws, message) {
    if ( message.type !== 'verify' ) {
      this.sendMessage(ws, {
        type: 'unverified'
      })
      return
    }

    if ( !message.token ) {
      return
    }

    let client = this.authService.verifyToken(message.token)

    if (!client) {
      return
    }

    if (client.user_id) {
      let user = await this.userService.getUserById(client.user_id)
      
      if (!user) {
        return
      } else {
        delete user.password
      }

      let index = this.userConnections.findIndex(item => {
        return item.user && item.user._id === client.user_id
      })

      if (index > -1) {
        this.userConnections[index].close()
      }

      ws.verify = 'user'
      ws.user = user

      this.userConnections.push(ws)

      this.sendMessage(ws, { type: 'verify', user: user })
    }

    if (client.monitor_id) {
      let monitor = await this.monitorService.getMonitorById(client.monitor_id)

      if (!monitor) {
        return
      } else {
        delete monitor.secret
      }

      let index = this.monitorConnections.findIndex(item => {
        item.monitor && item.monitor.monitor_id === client.monitor_id
      })

      if (index > -1) {
        this.monitorConnections[index].close()
      }

      ws.verify = 'monitor'
      ws.monitor = monitor

      this.monitorConnections.push(ws)

      this.sendMessage(ws, { type: 'verify', monitor: monitor })
    }
  }
}

module.exports = WebsocketServer