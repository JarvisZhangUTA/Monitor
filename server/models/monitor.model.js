
const mongoose = require('mongoose');

const MonitorSchema = mongoose.Schema({
  monitor_id: String,
  serial_num: String,
  secret: String,
  config: {
    EN_485: { type: Number, default: 4 },
    BAUD_RATE: { type: Number, default: 9600 },
    SERIAL_CYC: { type: Number, default: 20 },
    SERIAL_WAIT: { type: Number, default: 1 },
    COMMANDS: [
      { name: String, command: String }
    ]
  }
},{ 
  strict: false 
});

MonitorSchema.index({
  monitor_id: 1
})

const MonitorModel = mongoose.model('MonitorModel', MonitorSchema);
module.exports = MonitorModel;