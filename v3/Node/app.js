import express, { static } from 'express'
import webRouter from './routes'

import { createServer } from 'https'
import { join } from 'path'
import { readFileSync } from 'fs'
import { urlencoded, json } from 'body-parser'

/* Registration webpage */

const webApp = express()

webApp.set('view engine', 'pug')
webApp.set('views', join(__dirname, 'views'))
webApp.use(static(join(__dirname, 'public')))

webApp.use(static('public'))
webApp.use(urlencoded( { extended: true }))
webApp.use(json())
webApp.use(express['static'](__dirname))

webApp.use(webRouter)

webApp.listen(80, () => console.log('App listening on port 80!') )


/* API controller */

const api = express()
import apiRouter from './api_routes'
api.set('view engine', 'pug')

api.use(static('public'))
api.use(urlencoded( { extended: true }))
api.use(json())
api.use(express['static'](__dirname))

const https_key = readFileSync(join(__dirname, 'private.key'))
const https_cert = readFileSync(join(__dirname, 'primary.crt'))
const https_credentials = { key: https_key, cert: https_cert }

api.use(apiRouter)

createServer(https_credentials,api)
	.listen(3002)


/* Server sync */

import { requestServerIp, periodicSync } from './server_comm'

requestServerIp()
	.then( () => periodicSync(60 * 1000) )
