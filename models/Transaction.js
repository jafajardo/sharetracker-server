const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

// Create schema
const transactionSchema = new Schema({
  holdingName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  brokerageFee: {
    type: Number,
    required: true
  },
  transactionType: {
    type: String,
    enum: ["BUY", "SELL"],
    default: "BUY"
  },
  owner: {
    type: String,
    required: true
  }
});

const Transaction = model("transaction", transactionSchema);

module.exports = Transaction;
