'use strict';
var bodyParser = require('body-parser');
var http = require('http');
var config = require('./config')
var Connection = require('tedious').Connection;
var sqlhandlers = require('./controllers/dao')
var path = require('path')
var port = process.env.PORT || 1337;

const express = require('express')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index'))

app.listen(port, () => console.log('Desk Tracker listening on port 1337!'))

var connection = new Connection(config);
connection.on('connect', function (err) {
    // If no error, then good to proceed.  
    console.log("Connected");
    //sqlhandlers.readcargos(connection);
    sqlhandlers.updatecargos(connection);
});


