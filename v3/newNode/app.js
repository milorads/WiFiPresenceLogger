const express = require('express');
const routes = require ('./routes');
var https = require('https');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

/* ========================= login/registration controller ========================= */
const app = express();
app.set('view engine', 'pug');

//podesavnje default putanja do direktorijuma za pug i css
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express['static'](__dirname ));

app.use(routes);


app.listen(80, function () {
	console.log('App listening on port 80!');
});

/* ========================= api controller ========================= */

const app_api = express();
var api_routes = require('./api_routes');
app_api.set('view engine', 'pug');

app_api.use(express.static('public'))
app_api.use(bodyParser.urlencoded({ extended: true }));
app_api.use(bodyParser.json());
app_api.use(express['static'](__dirname ));

var https_key = fs.readFileSync('/home/admin/WiFiPresenceLogger/v2/newNode/private.key');
var https_cert = fs.readFileSync('/home/admin/WiFiPresenceLogger/v2/newNode/primary.crt');
var https_credentials = {key: https_key, cert: https_cert};

app_api.use(api_routes);
https.createServer(https_credentials,app_api).listen(3002);
