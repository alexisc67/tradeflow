// Database access

var Request = require("tedious").Request;
var TYPES = require("tedious").TYPES;
var async = require("async");
var config = require("../config");
var Connection = require("tedious").Connection;

function TradesModel() {
  //this.tradeDao = tradeDao;
}

// Read Trades View

TradesModel.prototype = {
  showTrades: function(req, res, next) {
    var data = [];
    var connection = new Connection(config);
    connection.on("connect", err => {
      // If no error, then good to proceed.
      console.log("Connected Request");
      // console.log(req);
      //res.render('index')
      var request = new Request(
        "SELECT DISTINCT vessel_id, origin_date, site_origin, seller, site_destination, destination_date, buyer, charterer, value, product_id, id FROM dbo.app_view_trades",
        (err, rowsLength, rows) => {
          if (err) {
            console.log(err);
          } else {
            // console.log("Number of trades " + rowsLength);
            // Loop check on each row
            for (var i = 0; i < rowsLength; i++) {
              // Create an object to save current row's data
              var trade = {
                vessel_id: rows[i][0].value,
                origin_date: rows[i][1].value,
                origin_id: rows[i][2].value,
                seller: rows[i][3].value,
                destination_id: rows[i][4].value,
                destination_date: rows[i][5].value,
                buyer: rows[i][6].value,
                charterer: rows[i][7].value,
                value: rows[i][8].value,
                product_id: rows[i][9].value,
                trade_id: rows[i][10].value
              };
              // Add object into array
              data.push(trade);
            }
            req.store = data;

            connection.close();
          }
          next();
        }
      );
      connection.execSql(request);
    });
  },

  // Insert New Trade: TODO need to pass parameters

  insertTrade: function(req, res, next) {
    console.log(req.body.origin_date);
    var tradesModel = [];
    var connection = new Connection(config);
    connection.on("connect", err => {
      // If no error, then good to proceed.
      console.log("Connected");
      var request = new Request(
        "EXEC insertTrade @vessel_id, @origin_date, @origin_id, @seller, @charterer, @buyer, @destination_id, @destination_date, @reference_id, @updated_by, @product_id, @value, @unit_of_measure_id",
        err => {
          if (err) {
            console.log(err);
          }
          return req.body;
          connection.close();
        }
      );
      request.addParameter("vessel_id", TYPES.Int, req.body.vessel_id);
      request.addParameter(
        "origin_date",
        TYPES.Date,
        new Date(req.body.origin_date)
      );
      request.addParameter("origin_id", TYPES.Int, 4);
      request.addParameter("seller", TYPES.NVarChar, req.body.seller);
      request.addParameter("charterer", TYPES.NVarChar, req.body.charterer);
      request.addParameter("buyer", TYPES.NVarChar, req.body.buyer);
      request.addParameter("destination_id", TYPES.Int, 1);
      request.addParameter(
        "destination_date",
        TYPES.Date,
        new Date(req.body.origin_date)
      );
      request.addParameter("reference_id", TYPES.Int, 555);
      request.addParameter("updated_by", TYPES.Int, 2);
      request.addParameter("product_id", TYPES.Int, req.body.product_id);
      request.addParameter("value", TYPES.Decimal, req.body.value);
      request.addParameter("unit_of_measure_id", TYPES.Int, 3);
      request.on("row", function(columns) {
        columns.forEach(function(column) {
          if (column.value === null) {
            console.log("NULL");
          } else {
            console.log("id of inserted item is " + column.value);
          }
        });
      });
      console.log(request);
      connection.execSql(request);
    });
  },

  // Delete Trade

  deleteTrade: function(req, res) {
    var connection = new Connection(config);
    connection.on("connect", err => {
      // If no error, then good to proceed.
      console.log("Delete Connected");
      console.log(req.body);
      var request = new Request(
        "DELETE FROM [dbo].[trades] WHERE id = @trade_id;",
        err => {
          if (err) {
            console.log(err);
          } else {
            return req.body;
            connection.close();
          }
        }
      );
      request.addParameter("trade_id", TYPES.Int, req.body.trade_id);
      connection.execSql(request);
    });
  },
  // Update Trade

  updateTrade: function(req, res) {
    var connection = new Connection(config);
    connection.on("connect", err => {
      // If no error, then good to proceed.
      console.log("Connected");

      var request = new Request(
        "UPDATE [dbo].[trades] SET [seller] = @seller, buyer = @buyer, charterer = @charterer, origin_date = @origin_date WHERE id = @trade_id;",
        err => {
          if (err) {
            console.log(err);
          } else {
            return req.body;
            connection.close();
          }
        }
      );
      request.addParameter(
        "origin_date",
        TYPES.Date,
        new Date(req.body.origin_date)
      );
      request.addParameter("trade_id", TYPES.Int, req.body.trade_id);
      request.addParameter("seller", TYPES.NVarChar, req.body.seller);
      request.addParameter("charterer", TYPES.NVarChar, req.body.charterer);
      request.addParameter("buyer", TYPES.NVarChar, req.body.buyer);
      //request.addParameter('value', TYPES.Decimal, req.body.value);
      //request.addParameter('product_name', TYPES.NVarChar, req.body.product_name);
      connection.execSql(request);
    });
  },

  // Get Location

  getLocation: function() {},

  // Get Vessel

  getVessel: function() {},

  // Get Vessel History
  // Loads the current trades for the selected vessel

  getVesselHistory: function(vesselId) {},

  useThis: function(vesselId) {},

  // Get Relevant Trades
  // Loads trades from Kpler that are relevant to the selected based on Vessel name and current period (current month)

  getRelevantTrades: function(req, res) {}
};

var getTradesFilter = function(query) {
  var result = {
    originDate: new RegExp(query.origin_date, "i"),
    originSite: new RegExp(query.site_origin, "i")
  };

  if (query.Vessel && query.Vessel !== "0") {
    result.Vessel = parseInt(query.Vessel, 10);
  }

  return result;
};

/*
// Read trades view
function readcargos(connection) {
    var request = new Request("SELECT * FROM dbo.app_view_trades", function (err) {
        if (err) {
            console.log(err);
        }
    });
    var result = "";
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    request.on('done', function (rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}
*/
module.exports = TradesModel;
