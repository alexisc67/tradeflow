// Read from database

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

function readcargos(connection) {
    var request = new Request("SELECT * FROM dbo.cargos", function (err) {
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

// Write to database

function updatecargos(connection) {
    var request = new Request("INSERT dbo.cargos (trade_id, product_id, value, unit_of_measure_id, updated_date) OUTPUT INSERTED.id VALUES (@trade_id, @product_id, @value, @unit_of_measure_id, CURRENT_TIMESTAMP);", function (err) {
        if (err) {
            console.log(err);
        }
    });
    request.addParameter('trade_id', TYPES.Int, 6);
    request.addParameter('product_id', TYPES.Int, 3);
    request.addParameter('value', TYPES.Decimal, 21000);
    request.addParameter('unit_of_measure_id', TYPES.Int, 1);
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                console.log("id of inserted item is " + column.value);
            }
        });
    });
    connection.execSql(request);
}  

module.exports = {
    readcargos: readcargos,
    updatecargos: updatecargos
}
