var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var sqlite3 = require('sqlite3').verbose();
var LogBase = new sqlite3.Database('/home/admin/WiFiPresenceLogger/v2/LogBase.db');
var RegBase = new sqlite3.Database('/home/admin/WiFiPresenceLogger/v2/RegBase.db');

var table_sql = `CREATE TABLE IF NOT EXISTS regList(RegId integer PRIMARY KEY NOT NULL UNIQUE,Mac TEXT,Ime TEXT,Prezime TEXT,Id TEXT)`;
var reg_sql = `SELECT * FROM regList WHERE Mac = ?`;
var insert_sql = `INSERT INTO regList (Mac,Ime,Prezime,Id) VALUES(?,?,?,?)`;


function getDateTableName()
{
	var today = new Date();
	var dayString = today.getDate();
	var monthString = today.getMonth();
	var yearString = Math.floor(today.getFullYear()%1000);
	if(Math.floor(today.getDate()/10) == 0)
	{
		dayString = "0" + today.getDate();
	}
	if(Math.floor((today.getMonth()+1)/10) == 0)
	{
		monthString = "0" + (today.getMonth()+1);
	}
	return 'Td_m_Y'.replace('Y', yearString).replace('m', monthString).replace('d', dayString);
}

//function for api methods
function checkCode(hashCode, timestamp) {
	console.log("check Hash Code");
	const devCode = "bfa86fdd-398c-462e-9b4e-9cb52ffafb58";
	var today = new Date();
	var tStamp = new Date(timestamp.replace(/T/, ' '));
	if((today - tStamp)/1000 > 100000) {
		return 2; //timeout
	} else {
		var code = devCode + timestamp;
		var localHashCode = crypto.createHash('md5').update(code).digest('hex');
		//console.log(localHashCode);
		if(hashCode == String(localHashCode)) {
			console.log(hashCode)
			console.log(localHashCode)
			return 1; //right hash
		} else {
			console.log(code)
			console.log(localHashCode)
			return 0; //wrong hash
		}
	}

}

http.createServer(function (request, response) {
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = __dirname + '/index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;      
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(3000);
console.log('Server running at http://172.24.1.1:3000/');


var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express['static'](__dirname ));

app.post('/registration', function(req, res) {
  
  console.log(req.body);
  // db insert implementation here
  var ime = req.body.name;
  var prezime = req.body.surname;
  var id = req.body.index;
  var ip = req.body.ip;
  if(ip == undefined)
  {
	  ip = req.connection.remoteAddress;
	  ip = ip.slice(7);
  }
  console.log(ip);
  //var tableName = getDateTableName();
  //console.log(tableName);
  //var tableName = "T09_01_18";
  
  RegBase.run(table_sql,(err) => {
	  if(err)
	  {
		  return console.error(err.message);
	  }
	  else
	  {
		  var tableName = getDateTableName();
		  var mac_sql = 'SELECT * FROM '+tableName + ' WHERE Ip = ? LIMIT 1';
		  
		  var mac;
			  LogBase.get(mac_sql,ip, (err, row) => {
			  if (err) {
				return console.error(err.message);
			  }
			  else{
				  if(row == undefined)
				  {
					console.log("uredjaj sa zadatom ip adresom ne postoji u arp tabeli");
					res.end("Uredjaj sa zadatom ip adresom ne postoji u arp listi");
				  }
				  else
				  {
					  mac = row.Mac;
					  console.log(mac);
					  
					  
					  RegBase.all(reg_sql,mac,(err,rows) => {
						  if(err){
							  return console.error(err.message);
						  }
						  else
						  {
							  if(rows == 0)
							  {
								res.end("Ne postoji mac adresa u bazi, sledi upis");
								  console.log("ne postoji ova mac adresa u bazi, sledi upis");
								  RegBase.run(insert_sql,[mac,ime,prezime,id],function(err){
									  if(err)
									  {
										res.end("greska pri upisu u bazu!");
										  return console.log(err.message);
									  }
									  else
									  {
										res.end("Registracija zavrsena");
										  console.log("upis novog korisnika zavrsen");
									  }
								  });
							  }
							  else
							  {
								  console.log("vec postoji mac adresa u regList tabeli"); 
								res.end("Ovaj uredjaj je vec registrovan");
							  }
						  }
					  });
					  
				  }
				  
				 

			  }
			});
	  }
  });
  
});

// Express route for any other unrecognised incoming requests
app.get('*', function(req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
});

app.listen(3001);

/* ========================= api methods ========================= */
var app_api = express();

app_api.get('/getData', function(req, res) {
	var kod = req.param("code");
	var timestamp = req.param("timestamp");
	switch (checkCode(kod, timestamp)) {
		case 0:
			console.log("Wrong hash.");
			res.end("Wrong hash.");
			break;
		case 1:
			console.log("Right hash.");

			var datum = req.param("file");
			var evidencija = `SELECT name FROM sqlite_master WHERE type='table' AND name='`+"T"+datum+`'`;

			LogBase.get(evidencija, (err, row) => {
				if (err) {
					console.error(err.message);
				} else {
					if (row == undefined) {
						console.log("Tabela ne postoji");
						res.end("Tabela ne postoji");
					} else {
						var sadrzaj = `SELECT * FROM `+row.name;

						LogBase.all(sadrzaj, (err, row) => {
							if (err) {
								console.error(err.message);
							} else {
								console.log(row);
								var odgovor = "";
								for (var i = 0; i < row.length; i++) {
									odgovor += row[i].LogBaseId+'|'+row[i].Mac+'|'+row[i].Ip+'|'+row[i].Ulaz+'|'+row[i].Izlaz+'\n';
								}
								res.end(odgovor);
							}
						});
					}
				}
			});
			break;
		case 2:
			console.log("Timeout.");
			res.end("Timeout.");
			break;
	}
});
app_api.get('/deleteData', function(req, res) {
	var kod = req.param("code");
	var timestamp = req.param("timestamp");
	switch (checkCode(kod, timestamp)) {
		case 0:
			console.log("Wrong hash.");
			res.end("Wrong hash.");
			break;
		case 1:
			console.log("Right hash.");

			var datum = req.param("file");
			var evidencija = `SELECT name FROM sqlite_master WHERE type='table' AND name='`+"T"+datum+`'`;

			LogBase.get(evidencija, (err, row) => {
				if (err) {
						console.error(err.message);
				} else {
					if (row == undefined) {
						console.log("Tabela ne postoji");
						res.end("Tabela ne postoji");
					} else {
						var brisi = `DROP TABLE `+row.name;
						LogBase.run(brisi, (er, row) => {
							if (er) {
								console.error(er.message);
							} else {
								console.log("Uspesno obrisana tabela");
								res.end("Uspesno obrisana tabela");
							}
						});
					}
				}
			});
			break;
		case 2:
			console.log("Timeout.");
			res.end("Timeout.");
			break;
	}
});
app_api.get('/apiTest', function(req, res) {
	var code = req.param("code");
	var timestamp = req.param("timestamp");
	console.log(code)
	console.log(timestamp);
	console.log("-------------------------");
	switch(checkCode(code, timestamp)) {
		case 0:
			console.log("Wrong hash");
			res.end("Wrong hash");
			break;
		case 1:
			console.log("Right hash");
			res.end("1");
			break;
		case 2:
			console.log("Timeout");
			res.end("Timeout");
			break;
	}
});
app_api.get('/listData',function(req, res) {
	var kod = req.param("code");
	var timestamp = req.param("timestamp");
	switch (checkCode(kod, timestamp)) {
		case 0:
			console.log("Wrong hash.");
			res.end("Wrong hash.");
			break;
		case 1:
			console.log("Right hash.");

			var tabele = `SELECT * FROM sqlite_master WHERE type='table'`;
			LogBase.all(tabele, (err, row) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log(row);
					var odgovor = "";
					for (var i = 0; i < row.length; i++) {
						odgovor += row[i].name+'\n';
					}
					res.end(odgovor);
				}
			});
			break;
		case 2:
			console.log("Timeout.");
			res.end("Timeout.");
			break;
	}
});
app_api.get('/getTimestamp', function(req, res) {
	console.log("method: getTimestamp");
	tStamp = new Date().toISOString().replace(/\..+/,'');
	res.end(tStamp);
});
app_api.get('/setTimestamp', function(req, res) {
	console.log("method: setTimestamp");
	var kod = req.param("code");
	var timestamp = req.param("timestamp");
	switch (checkCode(kod, timestamp)) {
		case 0:
			console.log("Wrong hash.");
			res.end("Wrong hash.");
			break;
		case 1:
			console.log("Right hash.");
			const exec = require('child_process').exec;
			var yourscript = exec('bash ../../rtc_set.bash', (error, stdout, stderr) => {
				console.log(`${stdout}`);
				console.log(`${stderr}`);
				if (error !== null) {
					console.log(`exec error: ${error}`);
				} else {
					console.log("Uspesno izvrsen bash fajl");
					res.end("Uspesno izvrsen bash fajl");
				}
			});
			break;
		case 2:
			console.log("Timeout.");
			res.end("Timeout.");
			break;
	}
});
app_api.get('/getRegList', function(req, res) {
	var kod = req.param("code");
	var timestamp = req.param("timestamp");
	switch (checkCode(kod, timestamp)) {
		case 0:
			console.log("Wrong hash.");
			res.end("Wrong hash.");
			break;
		case 1:
			console.log("Right hash.");

			var lista = `SELECT * FROM regList`;
			RegBase.all(lista, (err, row) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log(row);
					var odgovor = "";
					for (var i = 0; i < row.length; i++) {
						odgovor += row[i].RegId+'|'+row[i].Mac+'|'+row[i].Ime+'|'+row[i].Prezime+'|'+row[i].Id+'\n';
					}
					res.end(odgovor);
				}
			});
			break;
		case 2:
			console.log("Timeout.");
			res.end("Timeout.");
			break;
	}
});
app_api.listen(3002);
