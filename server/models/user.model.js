
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  permission: {
    can_send_request: { type: Boolean, default: false },
    can_upgrade: { type: Boolean, default: false }
  },
  monitors: [ String ]
},{ 
  strict: false 
});

UserSchema.index({
  email: 1,
  role: 1
})

const UserModel = mongoose.model('UserModel', UserSchema);
module.exports = UserModel;