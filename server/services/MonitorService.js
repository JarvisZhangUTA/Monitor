const MonitorModel = require('../models/monitor.model')

class MonitorService {
  async getMonitorById(monitor_id) {
    return await MonitorModel.findOne({monitor_id: monitor_id}).exec()
  }

  async getMonitorBySerialNum(serial_num) {
    return await MonitorModel.findOne({serial_num: serial_num}).exec()
  }

  async getMonitorByIdAndSecret(monitor_id, secret) {
    return await MonitorModel.findOne({monitor_id: monitor_id, secret: secret}).exec()
  }

  async createMonitor(monitorInfo) {
    let monitor = new MonitorModel(monitorInfo)
    await monitor.save()
    return monitor
  }

  async updateMonitor(monitorInfo) {
    let monitor = await MonitorModel.findOne({monitor_id: monitorInfo.monitor_id}).exec()
    if (!monitor) {
      return null
    }

    if (monitorInfo.config && monitorInfo.config.EN_485) {
      monitor.config.EN_485 = monitorInfo.config.EN_485
    }
    if (monitorInfo.config && monitorInfo.config.BAUD_RATE) {
      monitor.config.BAUD_RATE = monitorInfo.config.BAUD_RATE
    }
    if (monitorInfo.config && monitorInfo.config.SERIAL_CYC) {
      monitor.config.SERIAL_CYC = monitorInfo.config.SERIAL_CYC
    }
    if (monitorInfo.config && monitorInfo.config.SERIAL_WAIT) {
      monitor.config.SERIAL_WAIT = monitorInfo.config.SERIAL_WAIT
    }
    if (monitorInfo.config && monitorInfo.config.COMMANDS) {
      monitor.config.COMMANDS = monitorInfo.config.COMMANDS
    }

    monitor.save()

    return monitor
  }

  async getMonitorList (params) {
    params = Object.assign({
      page: 1,
      per_page: 40,
      ids: '',
      sort_by: null,
      sort_order: 'asc'
    }, params)

    const find = {}
    const sort = {}

    if (params.ids) {
      if (Array.isArray(params.ids)) {
        find.monitor_id = { $in: params.ids }
      } else {
        find.monitor_id = params.ids
      }
    }
    if (params.sort_by) {
      sort[params.sort_by] = params.sort_order
    }

    let data = await MonitorModel.find(find).sort(sort).limit(+params.per_page).skip(+params.per_page * (+params.page - 1)).exec();
    let total = await MonitorModel.find(find).countDocuments().exec();

    return {data, total}
  }

  async deleteMonitor(monitor_id) {
    return MonitorModel.deleteOne({ monitor_id: monitor_id }).exec()
  }
}

module.exports = MonitorService