const express = require('express')
const routes = require ('./routes')

const https = require('https')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')

const app = express()

/* Registration webpage */

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.static('public'))
app.use(bodyParser.urlencoded( { extended: true }))
app.use(bodyParser.json())
app.use(express['static'](__dirname))

app.use(routes)

app.listen(80, () => console.log('App listening on port 80!') )


/* API controller */

const app_api = express()
const api_routes = require('./api_routes')
app_api.set('view engine', 'pug')

app_api.use(express.static('public'))
app_api.use(bodyParser.urlencoded( { extended: true }))
app_api.use(bodyParser.json())
app_api.use(express['static'](__dirname))

const https_key = fs.readFileSync(path.join(__dirname, 'private.key'))
const https_cert = fs.readFileSync(path.join(__dirname, 'primary.crt'))
const https_credentials = { key: https_key, cert: https_cert }

app_api.use(api_routes)

https.createServer(https_credentials,app_api)
	.listen(3002)


/* Server sync */

const server_comm = require('./server_comm')

server_comm.requestServerIp()
	.then( () => server_comm.periodic_sync(60 * 1000) )
