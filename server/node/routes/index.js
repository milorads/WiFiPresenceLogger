const express = require('express');
const router = express.Router();

var mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'wifi_presence_logger'
});

var rsa = require('node-rsa');
var fs = require('fs');

const token_rsa = new rsa({b: 512});
const token_header = new Buffer(JSON.stringify({ alg: "rs256" })).toString('base64');

var deviceCode = 'bfa86fdd-398c-462e-9b4e-9cb52ffafb58';

Promise.prototype.respond = function(res) {
	this
	.then( data => {
		console.log('Request completed.')
		res.setHeader('error', 'ok')
		console.log('Data:', data)
		res.send(data)
		res.end()
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
		console.error('>Error:', err)
	})
}

/*
	Current version: desktop app sends the MAC address as a password.
 */
async function checkLogger(mac, key, callback) {
	// TODO implement proper authentication
}

/*
	Generates token 'payload.signature', where signature is encrypted 'header.payload'.
*/
async function getToken(mac) {
	try {
		var exp = new Date().getTime() + 180 * 1000;
		
		const payload = new Buffer(JSON.stringify({mac: mac, exp: exp}))
			.toString('base64');
		const plaintext = token_header + payload;
		const signature = token_rsa.sign(plaintext, 'base64', 'base64');
		const token = payload + '.' + signature;
		
		return Promise.resolve(token);
	} catch (err) {
		return Promise.reject('generation');
	}
}

router.post('/requestServerIp', function (req, res) {
	require('dns').lookup(require('os').hostname(), (err, address, fam) => {
		return address
	})
	.respond(res)
})

router.post('/getToken', function (req, res) {
	console.log('------------------------');
	console.log('Request: get token');
	var mac = ('mac' in req.body) ? req.body.mac : null;
	var key = ('key' in req.body) ? req.body.key : null;
	
	// Convert callback into promise
	new Promise( (resolve, reject) => {
		checkLogger(mac, key, (err) => {
			if (err)
				reject(err);
			else
				resolve();
		})
	})
	.then( () => {
		console.log('Logger authenticated.');
		return getToken(mac);
	}, err => {
		console.log('Logger authentication failed.');
		return Promise.reject(err);
	})
	.then( token => {
		console.log('New token generated. Token value is:', token);
		return token;
	})
	.respond(res)
});

async function authenticateToken(token) {
	return Promise.resolve('ok'); // TODO implement proper authentication
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

async function importLogs(mac, rows) {
	return new Promise( (resolve, reject) => {
		if (rows.length > 0) {
			var num = 0;
			var msg = '';
			rows.forEach( row => {
				console.log('Row:');
				console.log(row);
				
				con.query('CALL insertLog(?, ?, ?, ?)', [
					mac,
					row.mac,
					row.s_time,
					row.e_time
				], (err, result) => {
					if (err)
						msg += err.message + '; ';
				})
				if (++num == rows.length) resolve(msg);
			})
		} else {
			resolve();
		}
	})
}

async function importUsers(mac, rows) {
	return new Promise( (resolve, reject) => {
		if (rows.length > 0) {
			var num = 0;
			var msg = '';
			rows.forEach( row => {
				console.log('Row:');
				console.log(row);
				
				con.query('CALL importUser(?, ?, ?, ?, ?, ?, ?)', [
					mac,
					row.type,
					row.name,
					row.surname,
					row.id,
					row.sync_level,
					row.server_id
				], (err, result) => {
					if (err)
						msg += err.message + '; ';
				})
				if (++num == rows.length) resolve(msg);
			})
		} else {
			resolve();
		}
	})
}

async function importMacs(mac, rows) {
	return new Promise( (resolve, reject) => {
		if (rows.length > 0) {
			var num = 0;
			var msg = '';
			rows.forEach( row => {
				console.log('Row:');
				console.log(row);
				
				con.query('CALL importMac(?, ?, ?, ?)', [
					mac,
					row.server_id,
					row.mac,
					row.time
				], (err, result) => {
					if (err)
						msg += err.message + '; ';
				})
				if (++num == rows.length) resolve(msg);
			})
		} else {
			resolve();
		}
	})
}

async function exportUsers(mac) {
	return new Promise( (resolve, reject) => {
		con.query('CALL exportUsers(?)', [mac], (err, result) => {
			if (err)
				reject(err);
			else
				resolve(result[0]);
		})
	})
}

async function exportMacs(mac) {
	return new Promise( (resolve, reject) => {
		con.query('CALL exportMacs(?)', [mac], (err, result) => {
			if (err)
				reject(err);
			else
				resolve(result[0]);
		})
	})
}

router.post('/ping', function (req, res) {
	console.log('-----------------------');
	console.log('Request: ping');
	res.end();
})

router.post('/importLogs', function (req, res) {
	console.log('------------------------');
	console.log('Request: Import logs from logger');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		
		/*var comps = token.split('.');
		var mac = JSON.parse(Buffer.from(comps[0], 'base64'));
		*/
		var mac = ('mac' in req.body) ? req.body.mac : null;
		var rows = ('rows' in req.body) ? req.body.rows : null;
		console.log('Data extracted');
		console.log('Mac:', mac);
		
		return importLogs(mac, rows);
	}, err => {
		console.log('Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
})

router.post('/importUsers', function (req, res) {
	console.log('------------------------');
	console.log('--- Request: Import users from logger');
	var token = ('token' in req.body) ? req.body.token : null;
	var mac = ('mac' in req.body) ? req.body.mac : null;
	console.log('Mac:', mac);
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('--- Token authenticated.');
		res.setHeader('token', newToken);
		
		/*var comps = token.split('.');
		var mac = JSON.parse(Buffer.from(comps[0], 'base64'));
		*/
		var rows = ('rows' in req.body) ? req.body.rows : null;
		console.log('--- Data extracted');
		
		return importUsers(mac, rows);
	}, err => {
		console.log('--- Token authentication failed.');
		return Promise.reject(err);
	})
	.then( data => {
		console.log('--- Users imported. Sending users...');
		return exportUsers(mac);
	})
	.respond(res)
})

router.post('/importMacs', function (req, res) {
	console.log('------------------------');
	console.log('--- Request: Import MACs from logger');
	var token = ('token' in req.body) ? req.body.token : null;
	var mac = ('mac' in req.body) ? req.body.mac : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('--- Token authenticated.');
		res.setHeader('token', newToken);
		
		/*var comps = token.split('.');
		var mac = JSON.parse(Buffer.from(comps[0], 'base64'));
		*/
		var rows = ('rows' in req.body) ? req.body.rows : null;
		console.log('--- Data extracted');
		
		return importMacs(mac, rows);
	}, err => {
		console.log('--- Token authentication failed.');
		return Promise.reject(err);
	})
	.then( data => {
		console.log('--- MACs imported. Sending MACs...');
		return exportMacs(mac);
	})
	.respond(res)
})

router.post('/exportUsers', function (req, res) {
	console.log('------------------------');
	console.log('--- Request: Export users to logger');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('--- Token authenticated.');
		res.setHeader('token', newToken);
		
		var mac = ('mac' in req.body) ? req.body.mac : null;
		console.log('--- Data extracted');
		
		return exportUsers(mac);
	}, err => {
		console.log('--- Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
})

router.post('/exportMacs', function (req, res) {
	console.log('------------------------');
	console.log('Request: Export MACs to logger');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		
		var mac = ('mac' in req.body) ? req.body.mac : null;
		console.log('Data extracted');
		
		return exportMacs(mac);
	}, err => {
		console.log('Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
})


module.exports = router;
