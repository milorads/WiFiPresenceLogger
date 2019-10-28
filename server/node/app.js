import express, { static } from 'express'
import routes from './routes'

import https from 'https'
import http from 'http'
import { join } from 'path'
import { readFileSync } from 'fs'
import { urlencoded, json } from 'body-parser'

/* Server API */
const app = express()

app.use(static('public'))
app.use(urlencoded( { extended: true }))
app.use(json())
app.use(express['static'](__dirname))

const httpsKey = readFileSync(join(__dirname, 'private.key'))
const httpsCertificate = readFileSync(join(__dirname, 'primary.crt'))
const httpsCredentials = { key: httpsKey, cert: httpsCertificate }

app.use(routes)

// TODO implement https

//https.createServer(https_credentials,app).listen(3002);

const server = app.listen(80, '0.0.0.0',
	() => console.log(server.address())
)
