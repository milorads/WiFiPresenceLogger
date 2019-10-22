const utilsLib = require('./util')
const forEachResolve = utilsLib.forEachResolve
const performScript = utilsLib.performScript
const requestPost = utilsLib.requestPost

const database = require('./database').database

const LogManager = require('./info-log').LogManager
const logs = new LogManager(__filename)

var url = 'http://192.168.0.131:80/'
const broadcastUrl = 'http://255.255.255.255/'
var localMac = null

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
	
	const name = this.requestServerIp.name
	logs.trace(name, 'Requesting server IP...')
	
	const ip = await requestPost(`${broadcastUrl}serverIp`, { json: { } } )
	url = `http://${ip}:80/`
	logs.info(name, `Server URL: ${url}`)
}

const localExport = async procedure => {
	
	const name = this.localExport.name
	logs.trace(name, `Exporting from DB ${procedure} ...`)

	const result = await database.query(`CALL ${procedure}`)

	logs.trace(name, `${procedure} complete: ${result}`)
	return result
}

const localImport = async (procedure, instances) => {
	
	const name = this.localImport.name
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
	
	const name = this.sendRequest.name
	logs.trace(name, `Requesting from server: ${requestName} ...`)

	const response = await requestPost(`${url}${requestName}`,
		{ json: {
			token: 'ok',
			mac: localMac,
			rows: instances
		} }
	)

	logs.trace(name, `Response received for ${requestName}: ${response}`)
	return response
}

// TODO should be replaced by 'mac' from the util.js file
const fetchLocalMac = async () => {
	
	const name = this.fetchLocalMac.name

	if (localMac == null) {

		const output = await performScript(
			"ifconfig wlan0 | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}'"
		)
		localMac = output.substring(0, 17)
		logs.info(name, `Local MAC: ${localMac}`)
	}
}

const sync = async () => {

	const name = this.sync.name

	const ready = fetchLocalMac()
	.then( () => {
		logs.trace(name, 'Attempting connection with server')
		return Promise.race([
			sendRequest('ping', null),
			new Promise( (resolve, reject) => setTimeout(reject, 10000, 'timeout'))
		])
	})
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

const periodic_sync = async period => {
	sync()
		.then( () => {
			logs.trace(name, 'Sync successful')
			setTimeout( () => periodic_sync(period), period)
		}, () => {
			logs.trace(name, `Sync failed / Attempting again in ${period / 10000} seconds`)
			setTimeout( () => periodic_sync(period), period / 10)
		})
}

module.exports = {
	sync,
	periodic_sync,
	requestServerIp
}
