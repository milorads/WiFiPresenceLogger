var express = require('express');
var fs = require('fs');
var crypto = require('crypto');

var sqlite3 = require(`sqlite3`).verbose();
var LogBase = new sqlite3.Database(`../../LogBase.db`);

var app = express();
function checkCode(hashCode,timestamp)
{
	console.log("check Hash Code");
	const devCode = "bfa86fdd-398c-462e-9b4e-9cb52ffafb58";
	var today = new Date();
	var tStamp = new Date(timestamp);
	if((today - tStamp)/1000 > 100000)
		return 2; //timeout
	else
	{
		var code = devCode + timestamp;
		var localHashCode = crypto.createHash('md5').update(code).digest('hex');
		//console.log(localHashCode);
		if(hashCode == String(localHashCode))
		{
			console.log(hashCode)
			console.log(localHashCode)
			return 1; //right hash
		}
		else
		{
			console.log(code)
			console.log(localHashCode)
			return 0; //wrong hash
		}
	}

}
app.get('/getData',function(req,res){
        var kod = req.param("code");
	var timestamp = req.param("timestamp");
        switch (checkCode(kod, timestamp)) {
		case 0:
			console.log("Wrong hash.");
			break;
		case 1:
			console.log("Right hash.");

               		var datum = req.param("file");
                	var evidencija = `SELECT * FROM `+"T" + datum;

                	LogBase.all(evidencija, (err, row) => {
                        	if (err) {
                                	console.error(err.message);
                        	} else {
                                	console.log(row);
					res.end(row);
                        	}
                	});
			break;
		case 2:
			console.log("Timeout.");
			break;
	}
});

app.get('/deleteData',function(req,res){

});
app.get('/apiTest',function(req,res){
	var code = req.param("code");
	var timestamp = req.param("timestamp");
	console.log(code)
	console.log(timestamp);
	console.log("-------------------------");
	switch(checkCode(code,timestamp))
	{
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
app.get('/listData',function(req,res){

});
app.listen(3002);
