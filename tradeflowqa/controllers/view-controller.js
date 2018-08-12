var express = require("express");
var router = express.Router();
var TradesList = require("./dao");
var store = require("../store");

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

function filterData(filterObj, data) {
  const { product_id } = filterObj;
  var filters = {},
    key;
  for (key in filterObj) {
    if (filterObj[key] !== "" && filterObj[key] !== "0") {
      filters[key] = filterObj[key];
    }
  }
  console.log(filters);
  let newData = data.filter(item => {
    var test = true;
    for (filter in filters) {
      if (filter === "vessel_id" || filter === "product_id") {
        if (item[filter] !== parseInt(filters[filter])) {
          test = false;
        }
      } else {
        console.log("row charterer: ", item[filter]);
        console.log("filter value: ", filters[filter]);
        if (item[filter] !== filters[filter]) {
          test = false;
        }
      }
    }
    return test;
  });
  return newData;
}

// filter
router.get("/", function(req, res, next) {
  let filterValues = Object.values(req.query);
  let unFiltered = filterValues.reduce(
    (acc, val) => (val === "0" || val === "") && acc,
    true
  );
  console.log(req.query);
  if (unFiltered) {
    next();
  } else {
    res.json(filterData(req.query, req.store));
  }
});

//
router.get("/", function(req, res) {
  res.json(req.store);
});

router.post("/", function(req, res) {
  console.log("req.body");
  // console.log(req.body);
  req.modifyOriginalData([
    ...req.store,
    {
      ...req.body,
      destination_id: 1,
      updated_by: 2,
      reference_id: 555
    }
  ]);
  res.end();
});

router.put("/", function(req, res) {
  console.log("put");
});

router.delete("/", function(req, res) {
  console.log("delete");
  const { trade_id } = req.body;
  let d = req.store.filter(item => item.trade_id !== parseInt(trade_id));
  req.modifyOriginalData(d);
  res.end();
});

module.exports = router;
