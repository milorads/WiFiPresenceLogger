/**
 * Contains the logic for communicating with the server. Exports a function which periodically
 * synchronizes the local and server DB by sending and receiving requests from the server.
 */

import { mac, forEachResolve, requestPost } from './util'

import { database } from './database'

import { LogManager } from './info-log'
const logs = new LogManager(__filename)

var url = 'http://192.168.0.131:80/'
const broadcastUrl = 'http://255.255.255.255/'

/* Signatures of stored procedures for the local database */
const localExportUsers = 'exportUsers'
const localExportMacs = 'exportMacs'
const localExportLogs = 'exportLogs'

const localImportUsers = 'importUser(?, ?, ?, ?, ?, ?)'
const localImportMacs = 'importMac(?, ?, ?)'

/* Names of routes on the server (https requests) */
const serverImportUsers = 'importUsers'
const serverImportMacs = 'importMacs'
const serverImportLogs = 'importLogs'

/*
	Dynamic fetching of server's IP address. Not yet implemented
 */
const requestServerIp = async () => {
	
	const name = requestServerIp.name
	logs.trace(name, 'Requesting server IP...')
	
	const ip = await requestPost(`${broadcastUrl}serverIp`, { json: { } } )
	url = `http://${ip}:80/`
	logs.info(name, `Server URL: ${url}`)
}

const localExport = async procedure => {
	
	const name = localExport.name
	logs.trace(name, `Exporting from DB ${procedure} ...`)

	const result = await database.query(`CALL ${procedure}`)

	logs.trace(name, `${procedure} complete: ${result}`)
	return result
}

const localImport = async (procedure, instances) => {
	
	const name = localImport.name
	logs.trace(name, `Importing into DB ${procedure} ...`)

	if (instances.length > 0) {
		const call = `CALL ${procedure}`

		await forEachResolve(instances, instance => {
			logs.trace(name, `Current instance: ${instance}`)
			database.query(call, Object.values(instance))
		})
	}
	logs.trace(name, `${procedure} complete`)
}

const sendRequest = async (requestName, instances) => {
	
	const name = sendRequest.name
	logs.trace(name, `Requesting from server: ${requestName} ...`)

	const response = await requestPost(`${url}${requestName}`,
		{ json: {
			token: 'ok',
			mac: mac,
			rows: instances
		} }
	)

	logs.trace(name, `Response received for ${requestName}: ${response}`)
	return response
}

const sync = async () => {

	const name = sync.name
	logs.trace(name, 'Attempting connection with server')

	const ready = Promise.race([
		sendRequest('ping', null),
		new Promise( (resolve, reject) => setTimeout(reject, 10000, 'timeout'))
	])
	.then( () => logs.trace(name, 'Connection established') )
	
	const macsSent = ready
	.then( () => localExport(localExportUsers) )
	.then( users => sendRequest(serverImportUsers, users) )
	.then( users => localImport(localImportUsers, users) )
	.then( () => localExport(localExportMacs) )
	.then( macs => sendRequest(serverImportMacs, macs) )

	const logsExported = ready
	.then( () => localExport(localExportLogs) )
	
	const macsImported = macsSent
	.then( macs => localImport(localImportMacs, macs) )
	
	const logsSent = Promise.all([logsExported, macsSent])
	.then( values => sendRequest(serverImportLogs, values[0] /* logs */) )
	
	return Promise.all([macsImported, logsSent])
}

const periodicSync = async period => {

	const name = periodicSync.name
	
	sync()
		.then( () => {
			logs.trace(name, 'Sync successful')
			setTimeout( () => periodicSync(period), period)
		}, () => {
			logs.trace(name, `Sync failed / Attempting again in ${period / 10000} seconds`)
			setTimeout( () => periodicSync(period), period / 10)
		})
}

export {
	sync,
	periodicSync,
	requestServerIp
}
