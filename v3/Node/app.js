const express = require('express')
const routes = require ('./routes')

const https = require('https')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')

/* Registration webpage */

const webApp = express()

webApp.set('view engine', 'pug')
webApp.set('views', path.join(__dirname, 'views'))
webApp.use(express.static(path.join(__dirname, 'public')))

webApp.use(express.static('public'))
webApp.use(bodyParser.urlencoded( { extended: true }))
webApp.use(bodyParser.json())
webApp.use(express['static'](__dirname))

webApp.use(routes)

webApp.listen(80, () => console.log('App listening on port 80!') )


/* API controller */

const api = express()
const api_routes = require('./api_routes')
api.set('view engine', 'pug')

api.use(express.static('public'))
api.use(bodyParser.urlencoded( { extended: true }))
api.use(bodyParser.json())
api.use(express['static'](__dirname))

const https_key = fs.readFileSync(path.join(__dirname, 'private.key'))
const https_cert = fs.readFileSync(path.join(__dirname, 'primary.crt'))
const https_credentials = { key: https_key, cert: https_cert }

api.use(api_routes)

https.createServer(https_credentials,api)
	.listen(3002)


/* Server sync */

const serverComm = require('./server_comm')

serverComm.requestServerIp()
	.then( () => serverComm.periodic_sync(60 * 1000) )
