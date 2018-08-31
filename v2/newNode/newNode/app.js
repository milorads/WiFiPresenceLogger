const express = require('express');
const routes = require ('./routes');
var https = require('https');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');

/* ========================= login/registration controller ========================= */

/* Instanciranje express aplikacije */
const app = express();

/* setovanje engina za renderovnje dinamickih html strana da bude 'pug' */
app.set('view engine', 'pug');

/* podesavnje default putanja do direktorijuma za pug i css */
/* Dinamicke stranice za renderovanje i dinamicko menjanje sadrzaja su date */
/* u folderu /views kao .pug fajlovi */

app.set('views', path.join(__dirname, 'views'));

/* css fajlovi i sve slike su smestene u /public folderu */
app.use(express.static(__dirname + '/public'));

app.use(express.static('public'))

/* funkcije za parsiranje body i json-a */
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express['static'](__dirname ));

/* inkludovanje funkcija za rute */
app.use(routes);



/* setovanje aplikacije da slusa rekvestove na portu 80 */
app.listen(80, function () {
  console.log('server app listening on port 80!');
});

/* ========================= api controller ========================= */

/* instanciranje aplikacije za api metode */
const app_api = express();

/* inkludovanje funkcija za rute */
var api_routes = require('./api_routes');


app_api.use(express.static('public'))
app_api.use(bodyParser.urlencoded({extended: true}));
app_api.use(bodyParser.json());
app_api.use(express['static'](__dirname ));

/* ucitavanje kljuca i sertifikata za https protokol */
var https_key = fs.readFileSync('/home/admin/WiFiPresenceLogger/v2/newNode/private.key');
var https_cert = fs.readFileSync('/home/admin/WiFiPresenceLogger/v2/newNode/primary.crt');
var https_credentials = {key: https_key, cert: https_cert};

app_api.use(api_routes);

/* kreiranje https aplikacije na portu 3002 */
https.createServer(https_credentials,app_api).listen(3002);
console.log('api app  listening on port 3002!');