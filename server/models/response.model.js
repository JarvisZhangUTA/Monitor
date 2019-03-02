
const mongoose = require('mongoose');

const ResponseSchema = mongoose.Schema({
  monitor_id: String,
  date: Date,
  type: String,
  original: String
},{ 
  strict: false 
});

ResponseSchema.index({
  monitor_id: 1,
  date: 1,
  type: 1
})

const ResponseModel = mongoose.model('ResponseModel', ResponseSchema);
module.exports = ResponseModel;