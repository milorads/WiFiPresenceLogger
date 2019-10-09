var http = require('http');
var exec = require('child_process').exec;
var request = require('request');
var mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'wifi_presence_logger_logs'
});

var url = 'http://192.168.0.131:80/';
var broadcastUrl = 'http://255.255.255.255/';
var local_mac = null;

/* Signatures of stored procedures for the local database */
const dbexport_users = 'exportUsers';
const dbexport_macs = 'exportMacs';
const dbexport_logs = 'exportLogs';

const dbimport_users = 'importUser(?, ?, ?, ?, ?, ?)';
const dbimport_macs = 'importMac(?, ?, ?)';

/* Names of functions on the server (https requests) */
const simport_users = 'importUsers';
const simport_macs = 'importMacs';
const simport_logs = 'importLogs';

async function requestServerIp() {
	console.log('  >   Request server IP...');
	return new Promise( (resolve, reject) => {
		request.post(broadcastUrl + 'serverIp', {
			json: { }
		}, function (err, response, body) {
			if (err)
				reject(err)
			else
				resolve(body)
		})
	}).then( ip => {
		url = 'http://' + ip + ':80/'
		console.log('----- Server URL: ' + url)
	}, (_) => {
		console.log('----- Error: failed to get server IP')
	})
}

/*
	Export data from the local database.
	return value: Promise for the exported instances
*/
async function dbexport(procedure) {
	console.log('  >   Exporting from database:', procedure, ' ...');
	return new Promise( (resolve, reject) => {
		con.query('CALL ' + procedure, (err, result) => {
			if (err)
				reject(err)
			else
				resolve(result[0])
		})
	})
}

/*
	Import data into the local database.
*/
async function dbimport(procedure, instances) {
	console.log('  >   Importing into database:', procedure, ' ...');
	return new Promise( (resolve, reject) => {
		if (instances.length > 0) {
			var call = 'CALL ' + procedure;
			var num = 0;
			instances.forEach( instance => {
				console.log(instance);
				con.query(call, Object.values(instance), (err, result) => {
					if (err)
						console.log(err.message);
				})
				if (++num == instances.length)
					resolve()
			})
		} else {
			resolve()
		}
	})
}

async function sendRequest(req_name, instances) {
	console.log('  >   Requesting from server:', req_name, ' ...');
	return new Promise( (resolve, reject) => {
		request.post(url + req_name, {
			json: {
				token: 'ok',
				mac: local_mac,
				rows: instances
			}
		}, function (err, response, body) {
			if (err)
				reject(err)
			else
				resolve(body)
		})
	})
}

async function fetchLocalMac() {
	return new Promise( (resolve, reject) => {
		if (local_mac != null) {
			resolve();
		} else {
			exec("ifconfig wlan0 | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}'", (err, stdout, stderr) => {
				if (err) {
					reject('local_mac')
				} else {
					local_mac = stdout.substring(0, 17);
					resolve();
				}
			})
		}
	})
}

async function sync() {
	var ready =
	fetchLocalMac()
	.then( () => {
		console.log('--------------------------');
		console.log('----- Communication started.');
		return Promise.race([
			sendRequest('ping', null),
			new Promise( (resolve, reject) => setTimeout(reject, 10000, 'timeout'))
		])
	})
	.then( () => {
		console.log('----- Connection established.')
	})
	
	var send_macs = ready
	.then( () => {
		return dbexport(dbexport_users)
	})
	.then( users => {
		console.log('----- Users exported from database:');
		console.log(users);
		return sendRequest(simport_users, users)
	})
	.then( users => {
		console.log('----- Users sent to server. New users received:');
		console.log(users);
		return dbimport(dbimport_users, users)
	})
	.then( () => {
		console.log('----- Users imported into database.');
		return dbexport(dbexport_macs)
	})
	.then( macs => {
		console.log('----- MACs exported from database:');
		console.log(macs);
		return sendRequest(simport_macs, macs)
	})
	
	var import_macs = send_macs
	.then( macs => {
		console.log('----- MACs sent to server. New MACs received:');
		console.log(macs);
		return dbimport(dbimport_macs, macs)
	})
	.then( () => console.log('----- MACs imported into database.'))
	
	var export_logs = ready
	.then( () => dbexport(dbexport_logs) )
	
	var send_logs = Promise.all([export_logs, send_macs])
	.then( values => {
		var logs = values[0];
		console.log('----- Logs exported from database:');
		console.log(logs);
		return sendRequest(simport_logs, logs)
	})
	.then( () => console.log('----- Logs sent to server.'))
	
	return Promise.all([import_macs, send_logs])
	.then( () => {
		return Promise.resolve()
	}, err => {
		return Promise.reject(err)
	})
}

async function periodic_sync(period) {
		sync()
		.then( () => {
			console.log('Synchronization successful.');
			setTimeout( () => periodic_sync(period), period);
		}, err => {
			console.log('Synchronization failed. Attempting again in', period / 10000, 'seconds');
			setTimeout( () => periodic_sync(period), period / 10);
		})
	}

module.exports = {
	sync,
	periodic_sync,
	requestServerIp
}
