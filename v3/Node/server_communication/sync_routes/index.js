const express = require('express')
const sync_router = express.Router()

const utilLib = require('../../util')
const get = utilLib.get

const database = require('../../database').database

const LogManager = require('../../info-log').LogManager
const logs = new LogManager(__filename)

const TokenManager = require('../../token-manager').TokenManager
const tokenManager = new TokenManager()

const deviceCode = 'bfa86fdd-398c-462e-9b4e-9cb52ffafb58'

Promise.prototype.respond = res => {
	const name = 'Promise.respond'

	this
	.then( data => {
		logs.info(name, 'Request completed')
		res.setHeader('error', 'ok')
		res.end(data)
	}, err => {
		logs.error(name, 'Request failed')
		res.setHeader('error', err)
		res.end()
	})
	.then(
		() => logs.info(name, 'Response sent'),
		err => logs.error(name, 'Response sending failed', err.message)
	)
}

/* The system does not currently use this function */
const checkUser = async (username, password) => {
	const name = this.checkUser.name

	if (password == deviceCode) {
		logs.info(name, 'User authenticated')
		return
	} else {
		logs.error(name, 'User authentication failed')
		throw 'authentication'
	}
}

api_router.post('/getToken', (req, res) => {
	
	const name = '/getToken'
	logs.trace(name, 'Request: get token')

	Promise.resolve()
	.then( () =>
		checkUser(get(req, 'usr'), get(req, 'pass'))
	)
	.then( () =>
		tokenManager.generate(get(req, 'usr'))
	)
	.respond(res)
});

api_router.post('/exportUsers', (req, res) => {
	
	const name = 'exportUsersUrl'
	logs.trace(name, 'Request: export users')
	
	tokenManager.authenticateRequestDummy(req, res)
	.then( () => database.query('CALL exportUsers', []) )
	.respond(res)
})

const importUsers = async users => {
	
	/* Regular 'for' loop ensures ordered insertion */
	for (user in users) {
		database.query('CALL importUser(?, ?, ?, ?, ?, ?)',
			[user.type, user.name, user.surname, user.id, user.sync_level, user.server_id],
		)
	}
	return null
}

api_router.post('/importUsers', (req, res) => {
	
	const name = '/importUsers'
	logs.trace(name, 'Request: import users')
	
	tokenManager.authenticateRequestDummy(req, res)
	.then( () =>
		importUsers(get(req, 'users'))
	)
	.respond(res)
})

api_router.post('/exportMacs', (req, res) => {
	
	const name = '/exportMacs'
	logs.trace(name, 'Request: export MACs')
	
	tokenManager.authenticateRequestDummy(req, res)
	.then( () => database.query('CALL exportMacs', []) )
	.respond(res)
})

const importMacs = async macs => {
	
	/* Regular 'for' loop ensures ordered insertion */
	for (mac in macs) {
		database.query('CALL importMac(?, ?, ?)', [mac.mac, mac.time, mac.server_id])
	}
	return null
}

api_router.get('/importMacs', (req, res) => {
	
	const name = '/importMacs'
	logs.trace(name, 'Request: import MACs')
	
	tokenManager.authenticateRequestDummy(req, res)
	.then( () =>
		importMacs(get(req, 'macs'))
	)
	.respond(res)
});

api_router.post('/exportLogs', (req, res) => {
	
	const name = '/exportLogs'
	logs.trace(name, 'Request: export logs')
	
	tokenManager.authenticateRequestDummy(req, res)
	.then( () => database.query('CALL exportLogs', []) )
	.respond(res)
})


module.exports = sync_router