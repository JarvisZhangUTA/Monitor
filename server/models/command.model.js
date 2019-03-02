
const mongoose = require('mongoose');

const CommandSchema = mongoose.Schema({
  user_id: String,
  name: String,
  command: String
},{ 
  strict: false 
});

CommandSchema.index({
  user_id: 1
})

const CommandModel = mongoose.model('CommandModel', CommandSchema);
module.exports = CommandModel;