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
app.use(urlencoded({extended: true}))
app.use(json())
app.use(express['static'](__dirname))

const https_key = readFileSync(join(__dirname, 'private.key'))
const https_cert = readFileSync(join(__dirname, 'primary.crt'))
const https_credentials = {key: https_key, cert: https_cert}

app.use(routes)

// TODO implement https

//https.createServer(https_credentials,app).listen(3002);

const server = app.listen(80, '0.0.0.0',
	() => console.log(server.address())
)
