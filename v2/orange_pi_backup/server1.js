var http = require('http');
var fs = require("fs");
var connect = require("connect");
var sqlite3 = require('sqlite3').verbose();

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
