var express = require("express");
var router = express.Router();
var TradesList = require("./dao");

var tradesList = new TradesList();

var getClientFilter = function(query) {
  var result = {
    Vessel: query.vessel_id,
    Seller: query.seller
  };

  //if (query.Country && query.Country !== '0') {
  //    result.Country = parseInt(query.Country, 10);
  //}

  return result;
};

/* GET users listing. */
router.get("/", tradesList.showTrades);

// function (req, res, next) {
//   //filterTrades(req);
//   console.log(req.query);
//   console.log(res.locals.data);
//    tradesList.showTrades(getClientFilter(req.query), res);
//   //res.json(data);
//   }

router.post("/", tradesList.insertTrade);

router.put("/", tradesList.updateTrade);

router.delete("/", tradesList.deleteTrade);

module.exports = router;
