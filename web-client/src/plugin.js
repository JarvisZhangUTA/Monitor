import Socket from '@/utils/socket'
import config from '@/config'

const socket = new Socket(config)

export default {
  install: function(Vue) {
    Vue.prototype.$socket = socket
    Vue.prototype.$config = config
  }
}
