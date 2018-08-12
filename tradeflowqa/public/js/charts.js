var url = "http://localhost:1337/trades";

console.log(url);

d3.json(url).then(function (data) {
    console.log(data)

});

function getFilteredTrades() {
    return new Promise(function (resolve, reject) {
        d3.json(url, function (error, data) {
            console.log(data);
            if (error) {
                reject(error);
            } else {
                resolve(data);
           }
        });
    });
}

var t = getFilteredTrades()
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log(error);
    });


var margin = { top: 20, right: 40, bottom: 30, left: 20 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    barWidth = Math.floor(width / 19) - 1;

// An SVG element with a bottom-right origin.
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

