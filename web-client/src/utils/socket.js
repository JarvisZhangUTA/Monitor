export default class {
  constructor(config) {
    this.config = config
    this.subscribers = []
  }

  init(token) {
    if (this.token) { token = this.token }
    if (!token) { return }
    if (!this.config) { return }
    this.token = token
    this.ws = new WebSocket(`ws://${window.location.hostname}:${this.config.socket_port}`)
    this.ws.onopen = () => {
      this.ws.onmessage = (data) => this.onMessage(data)
      this.ws.onclose = (data) => this.onClose(data)
      this.sendMessage({ type: 'verify', token: token })
    }
  }

  onMessage(message) {
    if (!message.data) { return }
    try {
      message = JSON.parse(message.data)
      switch (message.type) {
        case 'connected':
          this.connected = true
          break
        case 'unverified':
          this.sendMessage({ type: 'verify', token: this.token })
          break
        default:
          this.subscribers.forEach(subscriber => {
            if (!subscriber || !subscriber.onMessage) {
              return
            }
            subscriber.onMessage(message)
          })
          break
      }
    } catch (e) {
      console.log(e)
    }
  }

  onClose() {
    this.connected = false
    this.init()
  }

  sendMessage(message) {
    this.ws.send(JSON.stringify(message))
  }

  subscribe(component) {
    this.subscribers.push(component)
  }

  unsubscribe(component) {
    const index = this.subscribers.indexOf(component)
    if (index > -1) {
      this.subscribers.splice(index, 1)
    }
  }
}
