const express = require('express');
const config = require('config');
const router = express.Router();

router.get("/check", async (req, res) => {
  try {
    res.status(200).json({ status: "healthy" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
})

module.exports = router;