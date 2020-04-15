const mongoose = require("mongoose");
const crypto = require('crypto');

const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: {
    type: String,
    required: false
  },

  resetPasswordExpires: {
    type: Date,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    required: false
  }
});
UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
module.exports = User = mongoose.model("users", UserSchema);
