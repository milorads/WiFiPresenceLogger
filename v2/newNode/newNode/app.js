const express = require('express');
const app = express();
const routes = require ('./routes');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
app.set('view engine', 'pug');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express['static'](__dirname ));

app.use(routes);



app.listen(80, function () {
  console.log('Example app listening on port 80!');
});

