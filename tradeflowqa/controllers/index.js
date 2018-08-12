var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index");
});

// app.get("/charts", function(req, res) {
//   res.render("charts", {
//     title: "Charts"
//   });
// });

module.exports = router;
