const express = require('express')
const routes = require ('./routes')

const https = require('https')
const http = require('http')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')

// ========================= controller =========================
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express['static'](__dirname))

const https_key = fs.readFileSync(path.join(__dirname, 'private.key'))
const https_cert = fs.readFileSync(path.join(__dirname, 'primary.crt'))
const https_credentials = {key: https_key, cert: https_cert}

app.use(routes)

//https.createServer(https_credentials,app).listen(3002);

const server = app.listen(80, '0.0.0.0',
	() => console.log(server.address())
)