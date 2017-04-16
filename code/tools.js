var rate_file_path='./rates.csv';

var requestType = {USER:0, AUTHENTIFICATION:1, IDENTIFICATON:2, LANGUAGE:3, TRANSLATOR:4, SESSION:5, CREDIT:6};
//USER 				: Table containing all the users (clients, translators)
//AUTHENTIFICATION	: Table containing not registered clients (Waiting the GET request with the token to be added to USER table)
//IDENTIFICATION 	: Table containing login clients

var profile		= {CLIENT:0, CLIENTTRANSLATOR:1, TRANSLATOR:2};
//CLIENT 			: Person who uses the service
//TRANSLATOR		: Person who does the translation service
//CLIENTTRANSLATOR 	: Person who does and uses the translation service

function rand() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

function generateToken() {
    return rand() + rand(); // to make it longer
};

function parseCSV(str) {
    var arr = [];
    var quote = false;
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';

        if (cc == '"' && quote && nc == '"') {
            arr[row][col] += cc;
            ++c;
            continue; 
        }

        if (cc == '"') {
            quote = !quote;
            continue; 
        }

        if (cc == ',' && !quote) {
            ++col;
            continue;
        }

        if (cc == '\n' && !quote) { 
            ++row; col = 0; 
            continue; 
        }

        arr[row][col] += cc;
    }
    return arr;
}

module.exports={
	rate_file_path,
	requestType,
	profile,
	generateToken,
	parseCSV
};