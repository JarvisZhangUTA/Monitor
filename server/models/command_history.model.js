
const mongoose = require('mongoose');

const CommandHistorySchema = mongoose.Schema({
  user_id: String,
  name: String,
  command: String,
  date: Date
},{ 
  strict: false 
});

CommandHistorySchema.index({
  user_id: 1,
  date: 1
})

const CommandHistoryModel = mongoose.model('CommandHistoryModel', CommandHistorySchema);
module.exports = CommandHistoryModel;