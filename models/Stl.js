const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StlSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  azureURL: {
    type: String,
    required: true
  },
  position: {
    x: Number,
    y: Number,
    z: Number
  },
  partType: String,
  nickName: String,
  tag1: String,
  tag2: String,
  partId: String
});

module.exports = Stl = mongoose.model("stls", StlSchema);
