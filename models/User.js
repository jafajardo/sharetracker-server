const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

// Create schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  }
});

const User = model("user", userSchema);

module.exports = User;
