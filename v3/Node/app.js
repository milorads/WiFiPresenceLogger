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

const httpsKey = readFileSync(join(__dirname, 'private.key'))
const httpsCertificate = readFileSync(join(__dirname, 'primary.crt'))
const httpsCredentials = { key: httpsKey, cert: httpsCertificate }

api.use(apiRouter)

createServer(httpsCredentials, api)
	.listen(3002)


/* Server sync */

import { requestServerIp, periodicSync } from './server_comm'

requestServerIp()
	.then( () => periodicSync(60 * 1000) )
