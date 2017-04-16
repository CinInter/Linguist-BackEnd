var fs      = require("fs");
var tools   = require('./tools.js');
//faissal
var column = {COUNTRY:0, TYPE:1, PREFIX:2, VOICE_PRICE:3, SMS_PRICE:4};

var country_rates=[];

var Rate = function (name,prefix, voice_price) {
  this.name         = name;
  this.prefix       = prefix;
  this.voice_price  = voice_price;
};


function loadRates(str) {
    fs.readFile(str, function (err, data) {
        if (err) {
            return console.error(err);
        }
        country_rates = tools.parseCSV(data.toString());
    });
}
function getRateForANumber(number) {
    var filtered_rates = [];
    var rate;

    for (var country_index = 0; country_index < country_rates.length; country_index++)
    {
        if(number.startsWith(country_rates[country_index][column.PREFIX])){
            rate = new Rate(country_rates[country_index][column.COUNTRY],country_rates[country_index][column.PREFIX],country_rates[country_index][column.VOICE_PRICE]);
            filtered_rates.push(rate);
        }
    }

    filtered_rates.sort(function(a, b) {
        return b.prefix.length-a.prefix.length;
    });

    return filtered_rates[0].voice_price;
}
module.exports={
    loadRates,
    getRateForANumber
};