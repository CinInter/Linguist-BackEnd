function connect(numberA,numberB) {
	console.log("TROPO: I will TRY to connect "+numberA+" to "+numberB);
	var request = require("request");

var options = { method: 'GET',
  url: 'https://api.tropo.com/1.0/sessions',
  qs: 
   { action: 'create',
     token: '49564d5a516550576563746752485870477979566a446e62444e614a4455615176777941514853537468736b',
     paramA: ' +33982289345',
     paramB: ' +33155665527' },
  headers: 
   { 'postman-token': '1c5fb307-4a93-fbcb-53c1-27d8db139407',
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

};

module.exports={
    connect
};