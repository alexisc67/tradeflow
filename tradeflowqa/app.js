'use strict';
var fetch = require('node-fetch');
var bodyParser = require('body-parser');
var http = require('http');
var config = require('./config')
var TradesList = require('./controllers/dao');
var trades = require('./controllers/trade')
var Connection = require('tedious').Connection;
var path = require('path')
var port = process.env.PORT || 1337;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');
var bodyParser = require('body-parser');
var routes = require('./controllers/index');
var d3 = require('d3');


const express = require('express')
const app = express()

//app.use('/static', express.static(path.join(__dirname, 'assets')))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var tradesList = new TradesList;

app.use('/', routes);
app.use('/trades', function (req, res, next) {
    let originalData = { d: 'data string' };
    res.locals.data = originalData;
    next();
}, trades);


app.get('/charts', function (req, res) {
    res.render('charts', {
        title: 'Charts'
    });
})

app.listen(port, () => console.log('Desk Tracker listening on port 1337!'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});