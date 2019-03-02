const MonitorModel = require('../models/monitor.model')

class MonitorService {
  async getMonitorById(monitor_id) {
    return await MonitorModel.findOne({monitor_id: monitor_id}).exec()
  }
}

module.exports = MonitorService