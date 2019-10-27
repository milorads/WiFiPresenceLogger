/**
 * This is an unused router. In the current version, the function periodicSync from server_comm
 * module communicates with the server by sending requests and fetching responses, so the server
 * sends the data by responding, not by sending requests to the device's routes. This module should
 * be used if this implementation changes.
 * 
 * The module should maybe be removed, to avoid confusion.
 */

import { Router } from 'express'
const router = Router()

import { get } from '../../util'

import { database } from '../../database'

import { LogManager } from '../../info-log'
const logs = new LogManager(__filename)

import { TokenManager } from '../../token-manager'
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
	
	const name = checkUser.name

	if (password == deviceCode) {
		logs.info(name, 'User authenticated')
		return
	} else {
		logs.error(name, 'User authentication failed')
		throw 'authentication'
	}
}

router.post('/getToken', (req, res) => {
	
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

router.post('/exportUsers', (req, res) => {
	
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

router.post('/importUsers', (req, res) => {
	
	const name = '/importUsers'
	logs.trace(name, 'Request: import users')
	
	tokenManager.authenticateRequestDummy(req, res)
	.then( () =>
		importUsers(get(req, 'users'))
	)
	.respond(res)
})

router.post('/exportMacs', (req, res) => {
	
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

router.get('/importMacs', (req, res) => {
	
	const name = '/importMacs'
	logs.trace(name, 'Request: import MACs')
	
	tokenManager.authenticateRequestDummy(req, res)
	.then( () =>
		importMacs(get(req, 'macs'))
	)
	.respond(res)
});

router.post('/exportLogs', (req, res) => {
	
	const name = '/exportLogs'
	logs.trace(name, 'Request: export logs')
	
	tokenManager.authenticateRequestDummy(req, res)
	.then( () => database.query('CALL exportLogs', []) )
	.respond(res)
})


export default router
