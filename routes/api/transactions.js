const express = require("express");
const Transaction = require("../../models/Transaction");
const auth = require("../../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ owner: req.user.id }).sort({
      holdingName: 1,
      date: -1
    });
    if (!transactions) {
      console.log("No transactions...");
    }
    res.status(200).json(transactions);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.post("/", auth, async (req, res) => {
  const newTransaction = new Transaction({
    owner: req.user.id,
    holdingName: req.body.holdingName,
    quantity: req.body.quantity,
    price: req.body.price,
    brokerageFee: req.body.brokerageFee,
    transactionType: req.body.transactionType,
    date: req.body.date
  });

  try {
    const transaction = await newTransaction.save();
    if (!transaction) {
      console.log("Error saving new transaction");
    }
    res.status(200).json(transaction);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      console.log("Item to delete not found.");
    }
    const removed = await transaction.remove();
    res.status(200).json(removed);
  } catch (e) {
    res.status(400).json({ msg: e.message, success: false });
  }
});

module.exports = router;
