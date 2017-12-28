var http = require('http');
var fs = require("fs");
var connect = require("connect");
var bodyParser = require('body-parser');
//var sqlite3 = require('sqlite3').verbose();
var express = require('express');
//za sada necemo kreirati baze

http.createServer(function(request, response) {
fs.readFile("index.html", function(err, data){
        if(err){
            response.writeHead(404);
            response.write("not Found!!");
        }
        else{
           response.writeHead(200,{'Content-Type':'text/html'});
           response.write(data);
        }
        response.end();
        });

}).listen(80);


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
  var surname  =req.body.surname;
  var index = req.body.index;
  var ip = req.connection.remoteAddress;
  var mac;
  console.log(ip);
});

app.get('*',function(req,res){
        res.status(404).send('Unrecognised API call');
});
app.use(function(err,req,res,next){
        if(req.xhr){
                res.status(500).send('Oops, Something went wrong!');
        }else{
                next(err);
        }
});
app.listen(3000);
