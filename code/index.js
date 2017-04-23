var express     	= require('express');
var bodyParser  	= require('body-parser');
var pg          	= require('pg');
var twilio        = require('twilio');
var dbExchange		= require('./dbExchange.js');
var tools 			  = require('./tools.js');
var rateExchange 	= require('./rateExchange.js');

var translation_fees_operator=0.5;

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json());
dbExchange.dropAllTables();
dbExchange.addTablesToDB();
rateExchange.loadRates(tools.rate_file_path);
var client = twilio("AC1cd2df05d94d3c79efc1b53da08e6bfa", "2ecc00df9bafcc8ba5f70a75d212b58c");

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var Translator = function (id,first_name,last_name,cost) {
  this.id                     = id;
  this.first_name             = first_name;
  this.last_name              = last_name;
  this.languages              = [];
  this.fitting_estimation     = 0;
  this.cost                   = cost + translation_fees_operator;
};

var Language = function (name, power) {
  this.name                   = name;
  this.power                  = power;
};

app.post('/register', function (req, res) {
	var email          = req.body.email;
	var password       = req.body.password;

	var parameter      =  { 	"email"			: email			,
								            "password"	: password	};

  //dbExchange.insert(tools.requestType.AUTHENTIFICATION,parameter,res);
  dbExchange.insert(tools.requestType.USER,parameter,res)
});

app.get('/register', function(req, res) {
  	var query 			  = require('url').parse(req.url,true).query;
  	var token       = query.token;

  	var parameter 		=  {	"token"			: token 		,
  								"email"			: null			,
  								"password"		: null		};


  	dbExchange.isAnElement(tools.requestType.AUTHENTIFICATION,parameter,res,function(deleted_structure){
  		parameter.email		=	deleted_structure.email;
  		parameter.password	=	deleted_structure.password;
  		dbExchange.delete(tools.requestType.AUTHENTIFICATION,parameter,res,function(deleted_structure){
  			dbExchange.insert(tools.requestType.USER,deleted_structure,res); 
  		});
  	});
});

app.get('/login', function(req, res) {
	var query 			= require('url').parse(req.url,true).query;
  	var email			= query.email;
  	var password		= query.password;

  	var parameter 		=  {	"email"			: email 		,
                        "password"		: password 		};

  	dbExchange.isAnElement(tools.requestType.USER,parameter,res,function(id_user){
  		dbExchange.insert(tools.requestType.IDENTIFICATON,id_user,res);
  	});
});

app.get('/logout', function(req, res) {
  var query   = require('url').parse(req.url,true).query;
  var token   = query.token;

  var parameter_token =  {  "token"     : token     };

  dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
      dbExchange.delete(tools.requestType.IDENTIFICATON,parameter_token,res)
    });

});

app.post('/update', function (req, res) {
	var first_name		= req.body.first_name;
	var last_name		= req.body.last_name;
	var phone_number	= req.body.phone_number;
  var translation_fees=req.body.translation_fees;
	var profile			= req.body.profile;
	var credit	= 0;
	var token			= req.body.token;

	var parameter_token =  { 	"token"			: token 		};
	var parameter_user 	=  {	"id"			: 0				,
  								"first_name"	: first_name	,
  					 			"last_name"		: last_name 	,
  					 			"phone_number"	: phone_number	,
                  "phone_rate" 	: parseFloat(rateExchange.getRateForANumber(phone_number)),
                  "translation_fees":translation_fees,
  					 			"profile" 		: profile		,
  					 			"credit"	: credit 	};

  	dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
  		parameter_user.id=id_user.id;
  		dbExchange.update(tools.requestType.USER,parameter_user,res);
  	});
});

app.post('/addLanguage', function (req, res) {
	var language		= req.body.language;
	var fluency			= req.body.fluency;
	var token			= req.body.token;

	var parameter_token =  { 	"token"			: token 		};
	var parameter_lang 	=  {	"id"			: 0				,
  								"language"		: language		,
  					 			"fluency"		: fluency 		};

  	dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
  		parameter_lang.id=id_user.id;
  		dbExchange.insert(tools.requestType.LANGUAGE,parameter_lang,res);
  	});
});

app.post('/removeLanguage', function (req, res) {
	var language		= req.body.language;
	var token			= req.body.token;
  console.log(req.body);
	var parameter_token =  { 	"token"			: token 		};
	var parameter_lang 	=  {	"id"			: null			,
  								      "language"		: language		};

	dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
		parameter_lang.id=id_user.id;
  		dbExchange.delete(tools.requestType.LANGUAGE,parameter_lang,res);
  	});
});

app.get('/getProfile', function (req, res) {
	var query            = require('url').parse(req.url,true).query;
	var token            = query.token;

	var parameter_token  = {  "token"			: token 		};
	var parameter_user 	 = {  "id"			: null			,
  								          "email"			: null			,
  								          "first_name"	: null			,
  								          "last_name"		: null			,
  								          "phone_number"	: null			,
  								          "profile"		: null			,
  								          "translation_fees"	: null			,
  					 			          "languages"		: null 			};

	dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
		parameter_user.id=id_user.id;
  		dbExchange.get(tools.requestType.USER,parameter_user,res,function(parameter){
  			parameter_user.email		=parameter.email;
  			parameter_user.first_name	=parameter.first_name;
  			parameter_user.last_name	=parameter.last_name;
  			parameter_user.phone_number	=parameter.phone_number;
  			parameter_user.profile 		=parameter.profile;
  			parameter_user.translation_fees =parameter.translation_fees;
  			dbExchange.get(tools.requestType.LANGUAGE,parameter_user,res,function(parameter){
  				res.status(200).json({"success": true, "data": parameter_user});
  			});
  		});
  	});
});


app.get('/getTranslator', function (req, res) {
	var query            = require('url').parse(req.url,true).query;
	var language		     = query.language;
	var token            = query.token;

	var parameter_token  =  {   "token"         : token 		};
	var parameter_lang 	 =  {   "id"            : 0				  ,
                              "language"      : language  ,
                              "languages"     : null			,
                              "user_cost"     : 0         ,
                              "translators"   : null      };

	dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
    parameter_lang.id=id_user.id;
    dbExchange.get(tools.requestType.USER,parameter_lang,res,function(parameter){
      parameter_lang.user_cost=parameter.phone_rate;
      dbExchange.get(tools.requestType.LANGUAGE,parameter_lang,res,function(parameter){
        dbExchange.get(tools.requestType.TRANSLATOR,parameter_lang,res,function(parameter){
          var user_languages=[];
          for (var language_index = 0; language_index < parameter.languages.length; language_index++)
            user_languages[parameter.languages[language_index].language]=parameter.languages[language_index].fluency;

          var translator_table=[];
          var previous_translator=0;
          var translator=null;
          for (var translator_index = 0; translator_index < parameter.translators.length; translator_index++) {
            if(previous_translator!=parameter.translators[translator_index].id){
              if(translator)
                translator_table.push(translator);
              translator = new Translator(parameter.translators[translator_index].id,parameter.translators[translator_index].first_name,parameter.translators[translator_index].last_name,parameter.translators[translator_index].translation_fees+parameter_lang.user_cost+parameter.translators[translator_index].phone_rate);
              if((user_languages[parameter.translators[translator_index].language])||(parameter.translators[translator_index].language==parameter.language)){
                translator.languages.push(new Language(parameter.translators[translator_index].language,parameter.translators[translator_index].fluency));
                if(user_languages[parameter.translators[translator_index].language])
                  translator.fitting_estimation+=parameter.translators[translator_index].fluency*user_languages[parameter.translators[translator_index].language];
                else
                  translator.fitting_estimation+=parameter.translators[translator_index].fluency*parameter.translators[translator_index].fluency;
              }
              previous_translator=parameter.translators[translator_index].id;
            }
            else{
              if((user_languages[parameter.translators[translator_index].language])||(parameter.translators[translator_index].language==parameter.language)){
                translator.languages.push(new Language(parameter.translators[translator_index].language,parameter.translators[translator_index].fluency));
                if(user_languages[parameter.translators[translator_index].language])
                  translator.fitting_estimation+=parameter.translators[translator_index].fluency*user_languages[parameter.translators[translator_index].language];
                else
                  translator.fitting_estimation+=parameter.translators[translator_index].fluency*parameter.translators[translator_index].fluency;
              }
            }
          }
          translator_table.push(translator);
          translator_table.sort(function(a, b) {
            return parseFloat(b.fitting_estimation) - parseFloat(a.fitting_estimation);
          });
          res.status(200).json({"success": true, "data": translator_table});
        });
      });
    });
  });
});

app.get('/getCredit', function (req, res) {
  var query       = require('url').parse(req.url,true).query;
  var token     = query.token;

  var parameter_token =  {  "token"     : token     };
  var parameter_user  =  {  "id"        : null,
                            "credit"    : null};

  dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
    parameter_user.id=id_user.id;
    dbExchange.get(tools.requestType.CREDIT,parameter_user,res,function(parameter){
      parameter_user.credit =parameter.credit;
      res.status(200).json({"success": true, "data": parameter_user});
    });
  });
});

app.get('/updateCredit', function (req, res) {
  var query       = require('url').parse(req.url,true).query;
  var token     = query.token;
  var credit    = query.credit;

  var parameter_token =  {  "token"     : token     };
  var parameter_user  =  {  "id"        : null,
                            "credit"    : credit};

  dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
    parameter_user.id=id_user.id;
    dbExchange.update(tools.requestType.CREDIT,parameter_user,res,function(parameter){
      parameter_user.credit =parameter.credit;
      res.status(200).json({"success": true, "data": parameter_user});
    });
  });
});

var onFinishedSession = function(token,duration){
  //TODO
  var parameter_token =  {  "token"     : token     };
  var res='';
  var parameter2='';
  var parameter3='';
  dbExchange.get(tools.requestType.SESSION,parameter_token,res,function(res){
  parameter2 =  {  "id"     : res.id_of_user , "credit" :(-res.translation_fees-res.user_phone_cost)*(duration/60)   };
  parameter3 =  {  "id"     : res.id_of_translator , "credit" :(res.translation_fees-res.translator_phone_cost)*(duration/60)   };
  console.log(parameter2.credit);
  console.log(parameter3.credit);
  dbExchange.update(tools.requestType.CREDIT,parameter2,res,function(param1){
  console.log(param1.credit);
  });
   dbExchange.update(tools.requestType.CREDIT,parameter3,res,function(param2){
  console.log(param2.credit);
  });
  });
   dbExchange.delete(tools.requestType.SESSION,parameter_token,res);
}

app.get('/updateCreditwassim', function (req, res) {
  var query     = require('url').parse(req.url,true).query;
  var id        = query.id;
  var credit    = query.credit;
  var parameter_user  =  {  "id"        : id,
                            "credit"    : credit};

    dbExchange.update(tools.requestType.CREDIT,parameter_user,res,function(parameter){
      parameter_user.credit =parameter.credit;
      res.status(200).json({"success": true, "data": parameter_user});
    });

});

app.get('/deletesession', function (req, res) {
 var query     = require('url').parse(req.url,true).query;
 var token     = query.token;
 var parameter_token =  {  "token"     : token    };
 console.log(parameter_token);
 dbExchange.delete(tools.requestType.SESSION,parameter_token,res);
});



app.get('/call', function (req, res) {
  var query            = require('url').parse(req.url,true).query;
  var token            = query.token;
  var translator_id    = query.translator_id;

  var parameter_token  =  {   "token"                 : token         };
  var user             =  {   "id"                    : 0             };
  var parameter_call   =  {   "user_id"               : 0             ,
                              "translator_id"         : translator_id ,
                              "user_phone"            : 0             ,
                              "translator_phone"      : 0             ,
                              "translation_fees"      : 0             ,
                              "user_phone_cost"       : 0             ,
                              "translator_phone_cost" : 0             ,
                              "token"                 : null          };

  dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
    parameter_call.user_id  = id_user.id;
    user.id                 = id_user.id;
    dbExchange.get(tools.requestType.USER,user,res,function(parameter){
      parameter_call.user_phone=parameter.phone_number;
      parameter_call.user_phone_cost=parameter.phone_rate;
      user.id=translator_id;
      dbExchange.get(tools.requestType.USER,user,res,function(parameter){
        parameter_call.translator_phone=parameter.phone_number;
        parameter_call.translator_phone_cost=parameter.phone_rate;
        parameter_call.translation_fees=parameter.translation_fees;
        dbExchange.insert(tools.requestType.SESSION,parameter_call,res,function(token){
          parameter_call.token=token;
          var url = 'https://linguist-twilio.herokuapp.com/outbound/' + encodeURIComponent(parameter_call.translator_phone);
          client.makeCall({to: parameter_call.user_phone, from: parameter_call.translator_phone, url: url}, function(err, message) {
            console.log(err);
            if (err) {
              response.status(500).send(err);
            } else {
              response.send({message: 'Thank you! We will be calling you shortly.'});
            }
          });
          //tropoExchange.connect(parameter_call.user_phone,parameter_call.translator_phone);
          res.status(200).json({"success": true, "token":token});
        });
      });
    });
  });
});

app.post('/call', function(request, response) {

    var url = 'https://linguist-twilio.herokuapp.com/outbound/' + encodeURIComponent("+33627443544");

    client.makeCall({to: "+33982289345", from: "+33627443544", url: url}, function(err, message) {
        console.log(err);
        if (err) {
            response.status(500).send(err);
        } else {
            response.send({
                message: 'Thank you! We will be calling you shortly.'
            });
        }
    });
});

app.post('/outbound/:salesNumber', function(request, response) {
    var salesNumber = request.params.salesNumber;
    var twimlResponse = new twilio.TwimlResponse();

    twimlResponse.say('Thanks for contacting our sales department. Our next available representative will take your call. ',{ voice: 'alice' });
    twimlResponse.dial(salesNumber);
    response.send(twimlResponse.toString());
});

/*
      *******************************************
      ************** Test Requests **************
      *******************************************
*/

app.get('/initTropoLinguistCredit', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query( 'create table if not exists tropo_linguist_table ('+
                  'tropo_credit        real ,'+
                  'linguist_credit     real  '+
                  ');insert into tropo_linguist_table values (0,0);', function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.end();}
    });
  });
});

app.get('/checkTropoLinguistCredit', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query( 'select * from tropo_linguist_table ;', function(err, result) {
      done();
      if (err){
        console.error(err);
        res.status(500).json({success: false, data: err});
      }
      else{
        res.status(200).json({"data": result.rows});
      }
    });
  });
});

app.get('/a', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('select * from authentification_user_table;',function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.send(result.rows ); }
    });
  });
});

app.get('/u', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('select * from user_table;',function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.send(result.rows ); }
    });
  });
});

app.get('/i', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('select * from identification_user_table;',function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.send(result.rows ); }
    });
  });
});

app.get('/s', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('select * from session_token_table;',function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.send(result.rows ); }
    });
  });
});

app.get('/', function (req, res) {
  var query            = require('url').parse(req.url,true).query;
  var token            = query.token;
  var duration         =query.duration;
  var parameter_token  = {  "token"     : token     };
  var parameter_user   = {  "id"      : null      ,
                            "email"     : null      ,
                            "first_name"  : null      ,
                            "last_name"   : null      ,
                            "phone_number"  : null      ,
                            "profile"   : null      ,
                            "translation_fees"  : null      ,
                            "languages"   : null      };
  onFinishedSession(token,duration);
  
  res.status(200).json({"success": "faissal" });

/*
  dbExchange.isAnElement(tools.requestType.IDENTIFICATON,parameter_token,res,function(id_user){
    parameter_user.id=id_user.id;
      dbExchange.get(tools.requestType.USER,parameter_user,res,function(parameter){
        parameter_user.email    =parameter.email;
        parameter_user.first_name =parameter.first_name;
        parameter_user.last_name  =parameter.last_name;
        parameter_user.phone_number =parameter.phone_number;
        parameter_user.profile    =parameter.profile;
        parameter_user.translation_fees =parameter.translation_fees;
        dbExchange.get(tools.requestType.LANGUAGE,parameter_user,res,function(parameter){
          res.status(200).json({"success": true, "data": parameter_user});
        });
      });
    });*/
});


app.get('/l', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('select * from language_table;',function(err, result) {
      done();
      if (err)
       { console.error(err); res.send("Error " + err); }
      else
       { res.send(result.rows ); }
    });
  });
});


app.post('/test', function(req, res) {
  console.log("received machin");
  var language    = req.body.results;
  console.log(language);
  res.status(200).json({"success": true, "data": "faissal"});
});

//app.get('/', function (req, res) {
//  res.send('hi');
	/*var query = require('url').parse(req.url,true).query;
  res.send('id='+query.id);
  res.send('option='+query.option);*/
//})

/*
app.get('/', function (req, res) {
  console.log("request from the application");
  res.send('OK');
});
*/

app.get('/times', function(request, response) {
    var result = ''
    var times = process.env.TIMES || 5
    for (i=0; i < times; i++)
      result += i + ' ';
  response.send(result);
});