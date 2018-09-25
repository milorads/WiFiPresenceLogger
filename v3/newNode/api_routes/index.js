const express = require('express');
const api_router = express.Router();

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
	
	// Convert callback into promise
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

async function apiTest(callback) {
	callback(null, "1");
}
api_router.post('/apiTest', function(req, res) {
	console.log('------------------------');
	console.log('Request: API test');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		return new Promise( (resolve, reject) => {
			apiTest( (err, data) => {
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

async function getData(datum, callback) {
	console.log(datum);
	con.query('CALL getLogs_byDate(?)', [datum], (err, result) => {
		if (err) {
			callback('err.message');
		} else if (result == undefined) {
			callback('undefined table');
		} else {
			var res = '';
			result[0].forEach((row, index) => {
				console.log(row);
				res += row.type + '|' + row.name + '|' + row.surname + '|' + row.id + '|' + row.mac
						+ '|' + row.stime + '|' + row.etime + ';';
			})
			console.log(res);
			callback(null, res.substring(0, res.length - 1));
		}
	})
}

api_router.post('/getData', function(req, res) {
	console.log('------------------------');
	console.log('Request: get data');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		var datum = ('file' in req.body) ? req.body.file : null;
		if (datum == null) return Promise.reject('parameters');
		
		// Convert callback into promise
		return new Promise( (resolve, reject) => {
			getData(datum, (err, data) => {
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

async function getData1(datum, callback) {
	con.query('CALL getLogs_byDate(?)', [datum], (err, result) => {
		if (err) {
			callback('err.message');
		} else {
			var res = '';
			result[0].forEach((row, index) => {
				res += row.type + '|' + row.name + '|' + row.surname + '|' + row.id + '|' + row.mac
						+ '|' + row.stime + '|' + row.etime + ';';
			})
			callback(null, res.substring(0, res.length - 1));
		}
	})
}

api_router.post('/getData1', (req, res) => {
	console.log('------------------------');
	console.log('Request: get data 1');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		var datum = ('file' in req.body) ? req.body.file : null;
		if (datum == null) return Promise.reject('parameters');
		
		return new Promise( (resolve, reject) => {
			getData1(datum, (err, data) => {
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

async function deleteData(dates, callback) {
	/************************/
	var datesList = dates.split(',');
	console.log("datumi:" , datesList);
	console.log("-----");
	/************************/
	datesList.forEach((date, index) => {
		con.query('CALL deleteLogs_byDate(?)', [date], function (err, result) {
			if (err) {
				console.error(err.message);
			}
		})
	})
	callback(null, 'ok');
}

api_router.post('/deleteData', (req, res) => {
	console.log('------------------------');
	console.log('Request: delete data');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		var dates = ('file' in req.body) ? req.body.file : null;
		if (dates == null) return Promise.reject('parameters');
		return new Promise( (resolve, reject) => {
			deleteData(dates, (err) => {
				if (err)
					reject(err);
				else
					resolve();
			})
		})
	}, err => {
		console.log('Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
})

async function listData(callback) {
	var tabele = `SELECT * FROM sqlite_master WHERE type='table'`;
	
	LogBase.all(tabele, (err, row) => {
		if (err) {
			console.error(err.message);
			callback(err.message);
		} else {
			console.log(row);
			var res = "";
			for (var i = 0; i < row.length; i++) {
				res += row[i].name+';';
			}
			res = res.substring(0, res.length - 1);
			callback(null, res);
		}
	});
}

api_router.post('/listData', (req, res) => {
	console.log('------------------------');
	console.log('Request: list data');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		return new Promise( (resolve, reject) => {
			listData( (err, data) => {
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

api_router.get('/getTimestamp', function(req, res) {
	console.log('------------------------');
	console.log('Request: get timestamp');
	try {
		tStamp = new Date().toISOString().replace(/\..+/,'');
		res.end(tStamp);
		console.log('Response sent');
	} catch (err) {
		console.log('Response sending failed');
	}
});

async function getTimeShift(callback) {
	const exec = require('child_process').exec;
	//var tStamp = new Date(timestamp.replace(/T/, ' '));
	
	var yourscript = await exec("date +'%Y-%m-%dT%H:%M:%S' && i2cdump -r 0-6 -y 1 0x68 b | grep 00:", (error, stdout, stderr) => {
		console.log(`${stdout}`);
		console.log(`${stderr}`);
		if (error !== null) {
			callback(`exec error: ${error}`);
		} else {
			var strArr = stdout.split('\n');
			var sysTime = new Date(strArr[0]);
			console.log("SYS time:" + sysTime);
			rtcStrArr = strArr[1].split(' ');
			var rtcTime = new Date("20"+rtcStrArr[7] + "-"+rtcStrArr[6]+"-"+rtcStrArr[5]+"T"+rtcStrArr[3]+":"+rtcStrArr[2]+":"+rtcStrArr[1]);
			console.log("RTC time" + rtcTime);
			console.log("shift: " + (sysTime-rtcTime)/1000);
			callback(null, String((sysTime-rtcTime)/1000));
		}
	});
}

api_router.post('/getTimeShift', (req, res) => {
	console.log('------------------------');
	console.log('Request: get time shift');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		return new Promise( (resolve, reject) => {
			getTimeShift( (err, data) => {
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

async function setSystemTime(actionCode, adminTimestamp, callback) {
	const exec = require('child_process').exec;
	
	bashProcess = await exec("sudo bash /home/admin/WiFiPresenceLogger/v3/sys_time.bash " + actionCode + " " + adminTimestamp, (error, stdout, stderr) => {
		console.log(`${stdout}`);
		console.log(`${stderr}`);
		if (error !== null) {
			callback(`exec error: ${error}`);
		} else {
			console.log(stdout);
			callback(null, stdout);
		}
	});
}

api_router.post('/setSystemTime', (req, res) => {
	console.log('------------------------');
	console.log('Request: set system time');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		var actionCode = ('actionCode' in req.body) ? req.body.actionCode : null;
		var adminTimestamp = ('adminTimestamp' in req.body) ? req.body.adminTimestamp : null;
		if (actionCode == null || adminTimestamp == null)
			return Promise.reject('parameters');
		return new Promise( (resolve, reject) => {
			setSystemTime(actionCode, adminTimestamp, (err, data) => {
				if (err)
					reject(err)
				else
					resolve(data)
			})
		})
	}, err => {
		console.log('Token authentication failed.');
		return Promise.reject(err);
	})
	.respond(res)
})

async function getRegList(callback) {
	con.query('CALL getLogs', (err, result) => {
		if (err) {
			callback(err.message);
		} else {
			var res = '';
			result[0].forEach((row, index) => {
				console.log(row);
				res += row.type + '|' + row.name + '|' + row.surname + '|' + row.id + '|' + row.mac
						+ '|' + row.stime + '|' + row.etime + ';';
			})
			callback(null, res.substring(0, res.length - 1));
		}
	})
}

api_router.post('/getRegList', (req, res) => {
	console.log('------------------------');
	console.log('Request: get reg list');
	var token = ('token' in req.body) ? req.body.token : null;
	console.log('Token:', token);
	
	authenticateToken(token)
	.then( newToken => {
		console.log('Token authenticated.');
		res.setHeader('token', newToken);
		return new Promise( (resolve, reject) => {
			getRegList( (err, data) => {
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


module.exports = api_router;
