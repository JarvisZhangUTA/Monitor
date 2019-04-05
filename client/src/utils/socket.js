export default class {
  constructor(config) {
    this.ws = new WebSocket(`ws://${window.location.hostname}:${config.socket_port}`)
  }
}
