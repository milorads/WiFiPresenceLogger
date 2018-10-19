const express = require('express');
const routes = require ('./routes');
var https = require('https');
var http = require('http');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

/* ========================= controller ========================= */
var app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express['static'](__dirname ));

var https_key = fs.readFileSync('/home/admin/WiFiPresenceLogger/server/node/private.key');
var https_cert = fs.readFileSync('/home/admin/WiFiPresenceLogger/server/node/primary.crt');
var https_credentials = {key: https_key, cert: https_cert};

app.use(routes);

//https.createServer(https_credentials,app).listen(3002);

var server;
new Promise( (resolve, reject) => {
	server = app.listen(80, '0.0.0.0', () => resolve())
})
.then( () => console.log(server.address())
)
