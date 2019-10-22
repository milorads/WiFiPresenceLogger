const express = require('express')
const router = express.Router()

const utilLib = require('../util')
const get = utilLib.get
const forEachResolve = utilLib.forEachResolve

const database = require('../database').database

const LogManager = require('../info-log').LogManager
const logs = new LogManager(__filename)

const TokenManager = require('../token-manager').TokenManager
const tokens = new TokenManager()

Promise.prototype.respond = res => {
	const name = 'Promise.respond'

	this
	.then( data => {
		logs.info(name, 'Request completed')
		res.setHeader('error', 'ok')
		res.send(data)
		res.end()
	}, err => {
		logs.error(name, 'Request failed', err)
		res.setHeader('error', err)
		res.end()
	})
	.then(
		() => logs.info(name, 'Response sent'),
		err => logs.error(name, 'Response sending failed', err.message)
	)
}

const checkLogger = async (mac, key) => {
	
	const name = this.checkLogger.name

	if (true) { // TODO implement proper authentication
		logs.trace(name, 'Logger authenticated')
		return
	} else {
		logs.error(name, 'Logger authentication failed')
		throw 'authentication'
	}
}

const importLogs = async (mac, rows) => {

	const name = this.importLogs.name

	if (rows.length > 0) {

		logs.trace(name, 'Importing logs...')

		await forEachResolve(rows, row => {
			logs.info(name, `Row: ${row}`)

			database.query('CALL insertLog(?, ?, ?, ?)',
				[mac, row.mac, row.s_time, row.e_time]
			)
		})
	}
}

const importUsers = async (mac, rows) => {

	const name = this.importUsers.name

	if (rows.length > 0) {

		logs.trace(name, 'Importing users...')

		await forEachResolve(rows, row => {
			logs.info(name, `Row: ${row}`)

			database.query('CALL importUser(?, ?, ?, ?, ?, ?, ?)',
				[mac, row.type, row.name, row.surname, row.id, row.sync_level, row.server_id]
			)
		})
	}
}

const importMacs = async (mac, rows) => {

	const name = this.importMacs.name

	if (rows.length > 0) {

		logs.trace(name, 'Importing MACs...')

		await forEachResolve(rows, row => {
			logs.info(name, `Row: ${row}`)

			database.query('CALL importMac(?, ?, ?, ?)',
				[mac, row.server_id, row.mac, row.time]
			)
		})
	}
}

const exportUsers = async users => {
	logs.trace(this.exportUsers.name, 'Exporting users...')
	return database.query('CALL exportUsers(?)', [users])
}

const exportMacs = async mac => {
	logs.trace(this.exportMacs.name, 'Exporting MACs...')
	return database.query('CALL exportMacs(?)', [mac])
}

router.post('/requestServerIp', (req, res) => {

	require('dns').lookup(require('os').hostname(),
		(err, address, fam) => address
	)
	.respond(res)
})

router.post('/getToken', (req, res) => {
	
	const name = '/getToken'
	logs.trace(name, 'Request: get token')
	
	Promise.resolve()
	.then( () =>
		checkLogger(get(req, 'mac'), get(req, 'key'))
	)
	.then( () =>
		tokens.generate(get(req, 'mac'))
	)
	.respond(res)
});

router.post('/ping', (req, res) => {
	
	const name = '/ping'
	logs.trace(name, 'Request: ping')
	res.end()
})

router.post('/importLogs', (req, res) => {

	const name = '/importLogs'
	logs.trace(name, 'Request: Import logs from logger')

	tokens.authenticateRequestDummy(req, res)
	.then( () =>
		importLogs(get(req, 'mac', true), get(req, 'rows'))
	)
	.respond(res)
})

router.post('/importUsers', (req, res) => {
	
	const name = '/importUsers'
	logs.trace(name, 'Request: Import users from logger')
	
	tokens.authenticateRequestDummy(req, res)
	.then( () =>
		importUsers(get(req, 'mac', true), get(req, 'rows'))
	)
	.then( () =>
		exportUsers(get(req, 'mac'))
	)
	.respond(res)
})

router.post('/importMacs', (req, res) => {
	
	const name = '/importMacs'
	logs.trace(name, 'Request: Import MACs from logger')
	
	tokens.authenticateRequestDummy(req, res)
	.then( () =>
		importMacs(get(req, 'mac', true), get(req, 'rows'))
	)
	.then( () =>
		exportMacs(get(req, 'mac'))
	)
	.respond(res)
})

router.post('/exportUsers', (req, res) => {
	
	const name = '/exportUsers'
	logs.trace(name, 'Request: Export users to logger')
	
	tokens.authenticateRequestDummy(req, res)
	.then( () =>
		exportUsers(get(req, 'mac', true))
	)
	.respond(res)
})

router.post('/exportMacs', (req, res) => {
	
	const name = '/exportMacs'
	logs.trace(name, 'Request: Export MACs to logger')
	
	tokens.authenticateRequestDummy(req, res)
	.then( () =>
		exportMacs(get(req, 'mac', true))
	)
	.respond(res)
})


module.exports = router