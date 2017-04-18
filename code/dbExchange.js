var pg 		= require('pg');
var tools 	= require('./tools.js');

function dropAllTables() {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('delete from user_table', function(err, result) {
			console.log('LOG INFO - dbExchange.js : user_table table is droped');
			done();
		});
	});
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('delete from authentification_user_table', function(err, result) {
			console.log('LOG INFO - dbExchange.js : authentification_user_table table is droped');
			done();
		});
	});
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('delete from session_token_table', function(err, result) {
			console.log('LOG INFO - dbExchange.js : session_token_table table is droped');
			done();
		});
	});
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('delete from language_table', function(err, result) {
			console.log('LOG INFO - dbExchange.js : language_table table is droped');
			done();
		});
	});
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('delete from identification_user_table', function(err, result) {
			console.log('LOG INFO - dbExchange.js : identification_user_table table is droped');
			done();
		});
	});
}

function addUserTableToDB() {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(	'create table if not exists user_table ('+
						'email				varchar(40) ,'+
						'password			varchar(20) ,'+
						'first_name 		varchar(20)	,'+
						'last_name  		varchar(20)	,'+
						'phone_number		varchar(20) ,'+
						'phone_rate			real 	    ,'+
						'translation_fees 	real 		,'+
						'profile			integer		,'+
						'credit				real 		,'+
						'id 				serial		 '+
						');', function(err, result) {
			console.log('LOG INFO - dbExchange.js : user_table table is added');
			done();
		});
	});
}

function addAuthentificationTokenTableToDB() {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(	'create table if not exists authentification_user_table ('+
						'email 				varchar(40)	,'+
						'password			varchar(20) ,'+
						'token				char(36)    ,'+
						'id 				serial		 '+
						');', function(err, result) {
			console.log('LOG INFO - dbExchange.js : authentification_user_table table is added');
			done();
		});
	});
}

function addIdentificationTokenTableToDB() {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(	'create table if not exists identification_user_table ('+
						'id_of_user 		integer		,'+
						'token				char(36)    ,'+
						'id 				serial		 '+
						');', function(err, result) {
			console.log('LOG INFO - dbExchange.js : identification_user_table table is added');
			done();
		});
	});
}

function addSessionTokenTableToDB() {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(	'create table if not exists session_token_table ('+
						'id_of_user 			integer	,'+
						'id_of_translator 		integer	,'+
						'translation_fees 		real 	,'+
						'user_phone_cost 		real 	,'+
						'translator_phone_cost 	real 	,'+
						'token					char(36),'+
						'id 					serial	 '+
						');', function(err, result) {
			console.log('LOG INFO - dbExchange.js : session_token_table table is added');
			done();
		});
	});
}

function addLanguageTableToDB() {
	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(	'create table if not exists language_table ('+
						'id_of_user 		integer		,'+
						'language			varchar(36) ,'+
						'fluency			integer     ,'+
						'id 				serial		 '+
						');', function(err, result) {
			console.log('LOG INFO - dbExchange.js : language_table table is added');
			done();
		});
	});
}

function insertAuthentificationToken(parameter,res) {
	var email			= parameter.email;
	var password		= parameter.password;
	var token 			= tools.generateToken();

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('insert into authentification_user_table values ($1,$2,$3);',[email,password,token], function(err, result) {
			done();
			if (err) {
				console.log('LOG EROR - dbExchange.js : There is an error in adding the email '+ email);
				console.error(err);
				res.status(500).json({success: false, data: err});
			} else{ 
				console.log('LOG INFO - dbExchange.js : The email ' + email + ' is added correctly');
				res.status(200).json({"success": true, "token": token}); 
			}
		});
	});
}

function insertIdentificationToken(parameter,res) {
	var id				= parameter.id;
	var token 			= tools.generateToken();

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('insert into identification_user_table values ($1,$2);',[id,token], function(err, result) {
			done();
			if (err) {
				console.log('LOG EROR - dbExchange.js : There is an error in in data base');
				console.error(err);
				res.status(500).json({"success": false, "data": "Error in data base"});
			} else{ 
				res.status(200).json({"success": true, "token": token}); 
			}
		});
	});
}

function insertUser(parameter,res) {
	var email			= parameter.email;
	var password 		= parameter.password;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('insert into user_table (email,password,credit) values ($1,$2,0);',[email,password], function(err, result) {
			done();
			if (err){
				console.log('LOG EROR - dbExchange.js : There is an error in adding the user '+ email);
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				console.error("successful");
				res.status(200).json({"success": true, "data": "authentificated"}); 
			}
		});
	});
}

function insertLanguage(parameter,res) {
	var id				= parameter.id;
	var language 		= parameter.language;
	var fluency			= parameter.fluency;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('insert into language_table values ($1,$2,$3);',[id,language,fluency], function(err, result) {
			done();
			if (err) {
				console.log('LOG EROR - dbExchange.js : There is an error in adding the language '+ language);
				console.error(err);
				res.status(500).json({success: false, data: err});
			} else{ 
				console.log('LOG INFO - dbExchange.js : The language ' + language + ' is added correctly');
				res.status(200).json({"success": true, "data": "added"}); 
			}
		});
	});
}

function insertSession(parameter,res,callback) {
	var token 			= tools.generateToken();

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('insert into session_token_table values ($1,$2,$3,$4,$5,$6);',[parameter.user_id,parameter.translator_id,parameter.translation_fees,parameter.user_phone_cost,parameter.translator_phone_cost,token], function(err, result) {
			done();
			if (err) {
				console.log('LOG EROR - dbExchange.js : There is an error in in data base');
				console.error(err);
				res.status(500).json({success: false, data: err});
			} else{ 
				callback(token);
			}
		});
	});
}

function removeAuthentificationToken(parameter,res,callback) {
	var token			= parameter.token;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('delete from authentification_user_table where token = $1;',[token], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.status(500).json({success: false, data: err});
			} else{ 
				callback(parameter);
			}
		});
	});
}

function removeIdentificationToken(parameter,res,callback) {
	var token			= parameter.token;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('delete from identification_user_table where token = $1;',[token], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.status(500).json({success: false, data: err});
			} else{ 
				res.status(200).json({"success": true, "data": "language removed"}); 
			}
		});
	});
}

function removeLanguage(parameter,res) {
	var id_of_user		= parameter.id;
	var language 		= parameter.language;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query("delete from language_table where id_of_user = $1 and language=any (array["+language+"]);",[id_of_user], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.status(500).json({success: false, data: err});
			} else{ 
				res.status(200).json({"success": true, "data": "languages removed"}); 
			}
		});
	});
}

function removeSession(parameter,res) {
	//TODO
	var token			= parameter.token;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('delete from session_token_table where token = $1;',[token], function(err, result) {
			done();
			if (err) {
				console.error(err);
				res.status(500).json({success: false, data: err});
			} else{ 
				res.status(200).json({"success": true, "data": "session removed"}); 
			}
		});
	});
}

function isAnElementOfAuthentificationTokenTable(parameter,res,callback) {
	var token			= parameter.token;
	var result;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('select * from authentification_user_table where token=$1',[token], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				if(result.rows.length===0)
					res.status(500).json({success: false, data: "Element not registered"});
				else{
					callback({"email": result.rows[0].email, "password": result.rows[0].password});
				}
			}
		});
	});
}

function isAnElementOfIdentificationTokenTable(parameter,res,callback) {
	var token			= parameter.token;
	var result;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('select * from identification_user_table where token=$1',[token], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				if(result.rows.length===0)
					res.status(500).json({success: false, data: "Element not registered"});
				else{
					callback({"id": result.rows[0].id_of_user});
				}
			}
		});
	});
}

function isAnElementOfUserTable(parameter,res,callback) {
	var email			= parameter.email;
	var password		= parameter.password;
	var result;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('select * from user_table where email=$1 and password=$2',[email,password], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				if(result.rows.length===0)
					res.status(200).json({"success": false, "data": "User does not exist"});
				else{
					callback({"id": result.rows[0].id});
				}
			}
		});
	});
}

function updateUser(parameter,res) {
	var id				= parameter.id;
	var first_name		= parameter.first_name;
	var last_name		= parameter.last_name;
	var phone_number	= parameter.phone_number;
	var phone_rate 		= parameter.phone_rate;
	var translation_fees= parameter.translation_fees;
	var profile			= parameter.profile;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('update user_table set first_name = $1, last_name = $2, phone_number = $3, phone_rate=$4, translation_fees=$5, profile=$6 where id = $7',[first_name,last_name,phone_number,phone_rate,translation_fees,profile,id], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				res.status(200).json({"success": true, "data": "updated"}); 
			}
		});
	});
}

function getSession(parameter,res,callback){
//TODO
var token= parameter.token;
pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('select * from session_token_table where token = $1',[token], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				callback({"id_of_user":result.rows[0].id_of_user,"user_phone_cost":result.rows[0].user_phone_cost,"id_of_translator":result.rows[0].id_of_translator ,"translator_phone_cost":result.rows[0].translator_phone_cost,"translation_fees":result.rows[0].translation_fees});
			}
		});
	});
}

function updateCredit(parameter,res,callback) {
	var id				= parameter.id;
	var credit			= parameter.credit;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('update user_table set credit=credit+$1 where id = $2 returning credit;',[credit,id], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				callback(result.rows[0]);
			}
		});
	});
}

function getUser(parameter,res,callback) {
	var id				= parameter.id;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('select * from user_table where id=$1',[id], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				callback(result.rows[0]);
			}
		});
	});	
}

function getCredit(parameter,res,callback) {
	var id				= parameter.id;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('select credit from user_table where id=$1',[id], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				callback(result.rows[0]);
			}
		});
	});	
}

function getLanguage(parameter,res,callback) {
	var id				= parameter.id;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query('select * from language_table where id_of_user=$1',[id], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				parameter.languages=result.rows;
				callback(parameter);
			}
		});
	});	
}

function getTranslator(parameter,res,callback) {
	var id				= parameter.id;
	var language 		= parameter.language;

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		client.query(`	select     user_table.id, user_table.first_name, translation_fees, phone_rate, user_table.last_name,language_table.language,language_table.fluency
                  		from       user_table 
                  		inner join language_table
                  		on         user_table.id=language_table.id_of_user
                  		where      language_table.id_of_user in (
                      		select  language_table.id_of_user 
                      		from    language_table 
                      		where   language_table.id_of_user in(
                          		select  user_table.id 
                          		from    user_table 
                          		where   user_table.id in (
                              		select  language_table.id_of_user 
                              		from    language_table 
                              		where   language_table.language in (
                                  		select  language_table.language 
                                  		from    language_table 
                                  		where   language_table.id_of_user = $1)) 
                              		and         user_table.profile>$2) 
                          		and     language_table.language=$3)`,[id,tools.profile.CLIENT,language], function(err, result) {
			done();
			if (err){
				console.error(err);
				res.status(500).json({success: false, data: err});
			}
			else{
				parameter.translators=result.rows;
				callback(parameter);
			}
		});
	});	
}

module.exports={
	addTablesToDB:function(){
		addUserTableToDB();
		addAuthentificationTokenTableToDB();
		addIdentificationTokenTableToDB();
		addLanguageTableToDB();
		addSessionTokenTableToDB();
	},
	dropAllTables,
	insert:function(type,parameter,res,callback){
		switch(type) {
			case tools.requestType.USER:
			insertUser(parameter,res);
			break;
			case tools.requestType.AUTHENTIFICATION:
			insertAuthentificationToken(parameter,res);
			break;
			case tools.requestType.IDENTIFICATON:
			insertIdentificationToken(parameter,res);
			break;
			case tools.requestType.LANGUAGE:
			insertLanguage(parameter,res);
			break;
			case tools.requestType.SESSION:
			insertSession(parameter,res,callback);
			break;
			default:
		} 
	},
	delete:function(type,parameter,res,callback){
		switch(type) {
			case tools.requestType.AUTHENTIFICATION:
			removeAuthentificationToken(parameter,res,callback);
			break;
			case tools.requestType.LANGUAGE:
			removeLanguage(parameter,res);
			break;
			case tools.requestType.Session:
			removeSession(parameter,res);
			break;
			case tools.requestType.IDENTIFICATON:
			removeIdentificationToken(parameter,res);
			break;
			default:
		} 
	},
	isAnElement:function(type,parameter,res,callback){
		switch(type) {
			case tools.requestType.AUTHENTIFICATION:
			isAnElementOfAuthentificationTokenTable(parameter,res,callback);
			break;
			case tools.requestType.USER:
			isAnElementOfUserTable(parameter,res,callback);
			break;
			case tools.requestType.IDENTIFICATON:
			isAnElementOfIdentificationTokenTable(parameter,res,callback);
			break;
			default:
		} 
	},
	update:function(type,parameter,res,callback){
		switch(type) {
			case tools.requestType.USER:
			updateUser(parameter,res);
			break;
			case tools.requestType.CREDIT:
			updateCredit(parameter,res,callback);
			break;
			default:
		} 
	},
	get:function(type,parameter,res,callback){
		switch(type) {
			case tools.requestType.USER:
			getUser(parameter,res,callback);
			break;
			case tools.requestType.LANGUAGE:
			getLanguage(parameter,res,callback);
			break;
			case tools.requestType.TRANSLATOR:
			getTranslator(parameter,res,callback);
			break;
			case tools.requestType.CREDIT:
			getCredit(parameter,res,callback);
			break;
			case tools.requestType.SESSION:
			getSession(parameter,res,callback);
			break;
			default:
		}
	}
};