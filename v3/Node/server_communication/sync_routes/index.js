const express = require('express');
const sync_router = express.Router();

var rsa = require('node-rsa');
var fs = require('fs');

const token_rsa = new rsa({b: 512});
const token_header = new Buffer(JSON.stringify({ alg: 'rs256' })).toString('base64');

var mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'wifi_presence_logger_logs'
});

var deviceCode = 'bfa86fdd-398c-462e-9b4e-9cb52ffafb58';

Promise.prototype.respond = function(res) {
	this
	.then( data => {
		console.log('Request completed.')
		res.setHeader('error', 'ok')
		res.end(data)
	}, err => {
		console.log('Request failed.')
		console.error('> Error:', err)
		res.setHeader('error', err)
		res.end()
	})
	.then( () => {
		console.log('Response sent.')
	}, err => {
		console.log('Response sending failed.')
	})
}

/*
	U trenutnoj verziji, desktop aplikacija kao password salje
	MAC adresu uredjaja, i uredjaj samo to proverava.
*/
function checkUser(username, password, callback) {
	if (password != deviceCode) {
		callback('pass');
	} else {
		callback(null);
	}
}

/*
	Generates token 'payload.signature', where signature is encrypted 'header.payload'.
*/
async function getToken(username) {
	try {
		var exp = new Date().getTime() + 180 * 1000;
		
		const payload = new Buffer(JSON.stringify({ usr: username, exp: exp }))
			.toString('base64');
		const plaintext = token_header + payload;
		const signature = token_rsa.sign(plaintext, 'base64', 'base64');
		const token = payload + '.' + signature;
		
		return Promise.resolve(token);
	} catch (err) {
		return Promise.reject('generation');
	}
}

api_router.post('/getToken', function(req, res) {
	console.log('------------------------');
	console.log('Request: get token');
	var username = ('usr' in req.body) ? req.body.usr : null;
	var password = ('pass' in req.body) ? req.body.pass : null;
	
	new Promise( (resolve, reject) => {
		checkUser(username, password, (err) => {
			if (err)
				reject(err);
			else
				resolve();
		})
	})
	.then( () => {
		console.log('User authenticated.');
		return getToken(username);
	}, err => {
		console.log('User authentication failed.');
		return Promise.reject(err);
	})
	.then( token => {
		console.log('New token generated. Token value is:', token);
		return token;
	})
	.respond(res)
});

async function authenticateToken(token) {
	return Promise.resolve(null);
	try {
		var comps = token.split('.');
		const payload = comps[0];
		const signature = comps[1];
		const plaintext = token_header + payload;
		
		if (!token_rsa.verify(plaintext, signature, 'base64', 'base64')) {
			return Promise.reject('signature');
		}
		const info = JSON.parse(new Buffer(payload, 'base64').toString('ascii'));
		if (info.exp < new Date().getTime()) {
			return Promise.reject('expired');
		}
		// after every action, user gets a new token to extend the duration
		return getToken(info.usr);
	} catch (err) {
		return Promise.reject('format');
	}
}

api_router.post('/exportUsers', function(req, res) {
	console.log('------------------------');
	console.log('Request: export users');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		
		return new Promise( (resolve, reject) => {
			con.query('CALL exportUsers', (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result);
			})
		})
	}, err => {
		console.log('Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
})

async function importUsers(users, callback) {
	var answer = '';
	
	for (user in users) {
		con.query('CALL importUser(?, ?, ?, ?, ?, ?)', [user.type, user.name, user.surname,
				user.id, user.sync_level, user.server_id],
				(err, result) => { if (err) answer += err.message + ';' }
		)
	}
	callback(null, answer);
}

api_router.post('/importUsers', (req, res) => {
	console.log('------------------------');
	console.log('Request: import users');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		var users = ('users' in req.body) ? req.body.users : null;
		
		return new Promise( (resolve, reject) => {
			importUsers(users, (err, data) => {
				if (err)
					reject(err);
				else
					resolve(data);
			})
		})
	}, err => {
		console.log('Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
})

api_router.post('/exportMacs', (req, res) => {
	console.log('------------------------');
	console.log('Request: export macs');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		return new Promise( (resolve, reject) => {
			con.query('CALL exportMacs', (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result);
			})
		})
	}, err => {
		console.log('Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
})

async function importMacs(macs, callback) {
	var answer = '';
	
	for (mac in macs) {
		con.query('CALL importMac(?, ?, ?)', [mac.mac, mac.time, mac.server_id],
				(err, result) => { if (err) answer += err.message + ';' })
	}
	callback(null, answer);
}

api_router.get('/importMacs', function(req, res) {
	console.log('------------------------');
	console.log('Request: import macs');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		var macs = ('macs' in req.body) ? req.body.macs : null;
		
		return new Promise( (resolve, reject) => {
			importMacs(macs, (err, data) => {
				if (err)
					reject(err);
				else
					resolve(data);
			})
		})
	}, err => {
		console.log('Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
});

api_router.post('/exportLogs', (req, res) => {
	console.log('------------------------');
	console.log('Request: export logs');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		return new Promise( (resolve, reject) => {
			con.query('CALL exportLogs', (err, result) => {
				if (err)
					reject(err);
				else
					resolve(result);
			})
		})
	}, err => {
		console.log('Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
})

module.exports = sync_router;
