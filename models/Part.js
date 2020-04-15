const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PartSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  meshes: [{
    type: Schema.Types.ObjectId,
    ref: "stls"
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Part = mongoose.model("parts", PartSchema);
