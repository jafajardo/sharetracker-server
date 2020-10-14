const express = require("express");
const request = require("request");
const router = express.Router();
const auth = require("../../middleware/auth");

/*
  @route /api/prices/:symbol
  @desc Retrieves the current price for the holding
  @access Private
*/
router.get("/:symbol", auth, (req, res) => {
  request(
    {
      url: `https://query1.finance.yahoo.com/v8/finance/chart/${req.params.symbol}.AX?region=US&lang=en-US&includePrePost=false&interval=1d&range=1d&corsDomain=localhost:3000`
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: error });
      }

      res.status(200).json(JSON.parse(body));
    }
  );
});

/*
  @route /api/prices/:symbol/:days
  @desc Retrieves the historical prices for the holding given number of days
  @access Private
*/
router.get("/:symbol/:days", auth, (req, res) => {
  request(
    {
      url: `https://query1.finance.yahoo.com/v8/finance/chart/${req.params.symbol}.AX?region=US&lang=en-US&includePrePost=false&interval=1d&range=${req.params.days}d&corsDomain=localhost:3000`
    },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: "error", message: error });
      }

      res.status(200).json(JSON.parse(body));
    }
  );
});

module.exports = router;
