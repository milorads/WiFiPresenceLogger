var express = require('express');
var fs = require('fs');
var crypto = require('crypto');

var sqlite3 = require(`sqlite3`).verbose();
var LogBase = new sqlite3.Database(`../../LogBase.db`);

var app = express();
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

app.get('/getData', function(req, res){
	var kod = req.param("code");
	var timestamp = req.param("timestamp");
	switch (checkCode(kod, timestamp)) {
		case 0:
			console.log("Wrong hash.");
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
						console.log("Tabela ne postoji")
					} else {
						var sadrzaj = `SELECT * FROM `+row.name;

						LogBase.all(sadrzaj, (err, row) => {
							if (err) {
								console.error(err.message);
							} else {
								console.log(row);
								var n = row.length;
								var i = 0;
								var odgovor = "";
								while (i != n) {
									odgovor += row[i].LogBaseId+'|'+row[i].Mac+'|'+row[i].Ip+'|'+row[i].Ulaz+'|'+row[i].Izlaz+'\n';
									i++;
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
			break;
	}
});
app.get('/deleteData', function(req, res){
	var kod = req.param("code");
	var timestamp = req.param("timestamp");
	switch (checkCode(kod, timestamp)) {
		case 0:
			console.log("Wrong hash.");
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
						console.log("Tabela ne postoji")
					} else {
						var brisi = `DROP TABLE `+row.name;
						LogBase.run(brisi, (er, row) => {
							if (er) {
								console.error(er.message);
							} else {
								console.log("Uspesno obrisana tabela");
								res.end("Uspesno si obrisao kralju");
							}
						});
					}
				}
			});
			break;
		case 2:
			console.log("Timeout.");
			break;
	}
});
app.get('/apiTest', function(req, res) {
	var code = req.param("code");
	var timestamp = req.param("timestamp");
	console.log(code)
	console.log(timestamp);
	console.log("-------------------------");
	switch(checkCode(code, timestamp)) {
		case 0:
			console.log("Wrong hash");
			break;
		case 1:
			console.log("Right hash");
			res.end("1");
			break;
		case 2:
			console.log("Timeout");
			break;
	}
});
app.get('/listData',function(req, res){
	var kod = req.param("code");
	var timestamp = req.param("timestamp");
	switch (checkCode(kod, timestamp)) {
		case 0:
			console.log("Wrong hash.");
			break;
		case 1:
			console.log("Right hash.");

			var tabele = `SELECT * FROM sqlite_master WHERE type='table'`;
			LogBase.all(tabele, (err, row) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log(row);
					var i = 0;
					var odgovor = "";
					while (i != row.length) {
						odgovor += row[i].name+'\n';
						i++;
					}
					res.end(odgovor);
				}
			});
			break;
		case 2:
			console.log("Timeout.");
			break;
	}
});
app.get('/getTimestamp',function(req,res){
	console.log("method: getTimestamp");
	tStamp = new Date().toISOString().replace(/\..+/,'');
	res.end(tStamp);
});
app.listen(3002);
