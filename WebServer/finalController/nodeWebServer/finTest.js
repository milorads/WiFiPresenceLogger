var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var pdb = new sqlite3.Database('./PDB.db');
var tdb = new sqlite3.Database('./TDB.db');

var app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express['static'](__dirname ));

app.post('/registration', function(req, res) {
  
  console.log(req.body);
  // db insert implementation here
  var name = req.body.name;
  var index = req.body.index;
  var ip = req.body.ip;
  var mac;
  // select * from tdb where ip address = req's ip
  //Perform SELECT Operation
	tdb.all("SELECT * FROM connections WHERE ip="+ip+"ORDER BY Id ASC LIMIT 1",function(err,rows){
		if (rows.length == 0) {
			res.send('There was an error, please try again later.');
		} else {
			rows.forEach(function (row) {  
            mac = row.Mac; 	
			}) 
			pdb.all("SELECT * FROM users where Mac="+mac,function(err,prows){
				if(prows.length ==0){
					// add to perm base and inform
					res.send('You have successfully registered the index number "' + req.body.index + '".');
				}
				else{
					//inform that already registered
				}
			});
		}
	});
  // if result found -> write down mac
  //insert into pdb index, mac date etc.
  
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

app.listen(3000);