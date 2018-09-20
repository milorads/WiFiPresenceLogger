const express = require('express');
var https = require('https');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

/* ========================= sync controller ========================= */

const app_sync = express();
var sync_routes = require('./sync_routes');
app_sync.set('view engine', 'pug');

app_sync.use(express.static('public'))
app_sync.use(bodyParser.urlencoded({ extended: true }));
app_sync.use(bodyParser.json());
app_sync.use(express['static'](__dirname ));

var https_key = fs.readFileSync('/home/admin/WiFiPresenceLogger/v2/newNode/private.key');
var https_cert = fs.readFileSync('/home/admin/WiFiPresenceLogger/v2/newNode/primary.crt');
var https_credentials = {key: https_key, cert: https_cert};

app_sync.use(sync_routes);
https.createServer(https_credentials, app_sync).listen(80);
