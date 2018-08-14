const express = require('express');
const api_router = express.Router();

var rsa = require('node-rsa');
var fs = require('fs');

const token_rsa = new rsa({b: 512});
const token_header = new Buffer(JSON.stringify({ alg: "rs256" })).toString('base64');


var sqlite3 = require('sqlite3').verbose();
var LogBase = new sqlite3.Database('/home/admin/WiFiPresenceLogger/v2/LogBase.db');
var RegBase = new sqlite3.Database('/home/admin/WiFiPresenceLogger/v2/RegBase.db');

var table_sql = `CREATE TABLE IF NOT EXISTS regList(RegId integer PRIMARY KEY NOT NULL UNIQUE,Mac TEXT,Ime TEXT,Prezime TEXT,Id TEXT)`;
var reg_sql = `SELECT * FROM regList WHERE Mac = ?`;
var insert_sql = `INSERT INTO regList (Mac,Ime,Prezime,Id) VALUES(?,?,?,?)`;

var deviceCode = 'bfa86fdd-398c-462e-9b4e-9cb52ffafb58';

function getDateTableName()
{
	var today = new Date();
	var dayString = today.getDate();
	var monthString = today.getMonth();
	var yearString = Math.floor(today.getFullYear()%1000);
	if(Math.floor(today.getDate()/10) == 0)
	{
		dayString = "0" + today.getDate();
	}
	if(Math.floor((today.getMonth()+1)/10) == 0)
	{
		monthString = "0" + (today.getMonth()+1);
	}
	return 'Td_m_Y'.replace('Y', yearString).replace('m', monthString).replace('d', dayString);
}

/* U trenutnoj verziji, desktop aplikacija kao password salje
 * MAC adresu uredjaja, i uredjaj samo to proverava.
 */
 
function checkUser(username, password, callback) {
	if (password != deviceCode) {
		callback('pass');
	} else {
		callback(null);
	}
}


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
		res.setHeader('error', 'ok');
		res.end(token);
	}, err => {
		console.log('Token generating failed.');
		console.error('> Error:', err);
		res.setHeader('error', err);
		res.end();
	})
	.then( () => {
		console.log('Response sent.');
	}, err => {
		console.log('Response sending failed.');
	})
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
		const newToken = getToken(info.usr);
		return Promise.resolve(newToken);
	} catch (err) {
		return Promise.reject('format');
	}
}

async function getData(datum, callback) {
	var evidencija = `SELECT name FROM sqlite_master WHERE type='table' AND name='` + "T" + datum + `'`;
	
	LogBase.get(evidencija, (err, row) => {
		if (err) {
			callback(err.message);
		} else {
			if (row == undefined) {
				callback('undefined table');
			} else {
				var sadrzaj = `SELECT * FROM `+row.name;
				
				LogBase.all(sadrzaj, (err, row) => {
					if (err) {
						callback(err.message);
					} else {
						console.log(row);
						var odgovor = "";
						for (var i = 0; i < row.length; i++) {
							odgovor += row[i].LogBaseId+'|'+row[i].Mac+'|'+row[i].Ip+'|'+row[i].Ulaz+'|'+row[i].Izlaz+';';
						}
						odgovor = odgovor.substring(0,odgovor.length - 1);
						callback(null, odgovor);
					}
				});
			}
		}
	});
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
	.then( data => {
		console.log('Request completed.');
		res.setHeader('error', 'ok');
		res.end(data);
	}, err => {
		console.log('Request failed.');
		console.error('> Error:', err);
		res.setHeader('error', err);
		res.end();
	})
	.then( () => {
		console.log('Response sent.');
	}, err => {
		console.log('Response sending failed.');
	})
})

async function getData1(datum, callback) {
	var evidencija = `SELECT name FROM sqlite_master WHERE type='table' AND name='` + "T" + datum + `'`;
	
	LogBase.get(evidencija, (err, row) => {
		if (err) {
			callback(err.message);
		} else {
			if (row == undefined) {
				callback('undefined table');
			} else {
				var sadrzaj = `SELECT * FROM `+row.name;

				LogBase.all(sadrzaj, (err, row) => {
					if (err) {
						callback(err.message);
					} else {
						//console.log(row);
						/***************************************************/
						var regListDict = [];
						regSql = `SELECT * FROM regList`;
						RegBase.all(regSql,(err,row1) => {
							for(var i = 0;i<row1.length;i++)
							{
								regListDict[row1[i].Mac] = row1[i].Ime + "|" + row1[i].Prezime + "|" + row1[i].Id;
							}
							
							var odgovor = "";
							for (var i = 0; i < row.length; i++) {
								var imePrezime = regListDict[row[i].Mac];
								odgovor += regListDict[row[i].Mac]+'|'+row[i].Ulaz+'|'+row[i].Izlaz+';';
							}
							console.log("response: " + odgovor);
							callback(null, odgovor);
						/***************************************************/
						});
						//odgovor = odgovor.substring(0,odgovor.length - 1);
					}
				});
			}
		}
	});
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
	.then( data => {
		console.log('Request completed.');
		res.setHeader('error', 'ok');
		res.end(data);
	}, err => {
		console.log('Request failed.');
		console.error('> Error:', err);
		res.setHeader('error', err);
		res.end();
	})
	.then( () => {
		console.log('Response sent.');
	}, err => {
		console.log('Response sending failed.');
	})
})

async function deleteData(dates, callback) {
	/************************/
	var tableList = dates.split(',');
	console.log("table lista: " , tableList);
	console.log("-----");
	/************************/
	for (var datum in tableList)
	{
		var evidencija = `SELECT name FROM sqlite_master WHERE type='table' AND name='` + tableList[datum] + `'`;
		console.log("upit za brisanje: " + evidencija);
		LogBase.get(evidencija, (err, row) => {
			if (err) {
					console.error(err.message);
			} else {
				if (row == undefined) {
					console.log("Tabela ne postoji");
				} else {
					var brisi = `DROP TABLE `+row.name;
					LogBase.run(brisi, (er, row) => {
						if (er) {
							console.error(er.message);
						} else {
							console.log("Uspesno obrisana tabela");
							//result.end("Uspesno obrisana tabela");
						}
					});
				}
			}
		});
	}
	callback(null);
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
	.then( () => {
		console.log('Request completed.');
		res.setHeader('error', 'ok');
		res.end();
	}, err => {
		console.log('Request failed.');
		console.error('> Error:', err);
		res.setHeader('error', err);
		res.end();
	})
	.then( () => {
		console.log('Response sent.');
	}, err => {
		console.log('Response sending failed.');
	})
})

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
	.then( data => {
		console.log('Request completed.');
		res.setHeader('error', 'ok');
		res.end(data);
	}, err => {
		console.log('Request failed.');
		console.error('> Error:', err);
		res.setHeader('error', err);
		res.end();
	})
	.then( () => {
		console.log('Response sent.');
	}, err => {
		console.log('Response sending failed.');
	})
})

async function listData(callback) {
	var tabele = `SELECT * FROM sqlite_master WHERE type='table'`;
	
	LogBase.all(tabele, (err, row) => {
		if (err) {
			console.error(err.message);
			callback(err.message);
		} else {
			console.log(row);
			var odgovor = "";
			for (var i = 0; i < row.length; i++) {
				odgovor += row[i].name+';';
			}
			odgovor = odgovor.substring(0,odgovor.length - 1);
			callback(null, odgovor);
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
	.then( data => {
		console.log('Request completed.');
		res.setHeader('error', 'ok');
		res.end(data);
	}, err => {
		console.log('Request failed.');
		console.error('> Error:', err);
		res.setHeader('error', err);
		res.end();
	})
	.then( () => {
		console.log('Response sent.');
	}, err => {
		console.log('Response sending failed.');
	})
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
	.then( data => {
		console.log('Request completed.');
		res.setHeader('error', 'ok');
		res.end(data);
	}, err => {
		console.log('Request failed.');
		console.error('> Error:', err);
		res.setHeader('error', err);
		res.end();
	})
	.then( () => {
		console.log('Response sent.');
	}, err => {
		console.log('Response sending failed.');
	})
})

async function setSystemTime(actionCode, adminTimestamp, callback) {
	const exec = require('child_process').exec;
	
	bashProcess = await exec("sudo bash /home/admin/WiFiPresenceLogger/v2/sys_time.bash " + actionCode + " " + adminTimestamp, (error, stdout, stderr) => {
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
	.then( data => {
		console.log('Request completed.');
		res.setHeader('error', 'ok');
		res.end(data);
	}, err => {
		console.log('Request failed.');
		console.error('> Error:', err);
		res.setHeader('error', err);
		res.end();
	})
	.then( () => {
		console.log('Response sent.');
	}, err => {
		console.log('Response sending failed.');
	})
})

async function getRegList() {
	var lista = `SELECT * FROM regList`;
	
	RegBase.all(lista, (err, row) => {
		if (err) {
			callback(err.message);
		} else {
			console.log(row);
			var odgovor = "";
			for (var i = 0; i < row.length; i++) {
				odgovor += row[i].RegId+'|'+row[i].Mac+'|'+row[i].Ime+'|'+row[i].Prezime+'|'+row[i].Id+';';
			}
			odgovor = odgovor.substring(0, odgovor.length - 1);
			callback(null, odgovor);
		}
	});
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
	.then( data => {
		console.log('Request completed.');
		res.setHeader('error', 'ok');
		res.end(data);
	}, err => {
		console.log('Request failed.');
		console.error('> Error:', err);
		res.setHeader('error', err);
		res.end();
	})
	.then( () => {
		console.log('Response sent.');
	}, err => {
		console.log('Response sending failed.');
	})
});


module.exports = api_router;
