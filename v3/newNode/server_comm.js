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

var url = 'http://168.63.6.115:80/';
var local_mac = null;

// Signatures of stored procedures for the local database
const dbexport_users = 'exportUsers';
const dbexport_macs = 'exportMacs';
const dbexport_logs = 'exportLogs';

const dbimport_users = 'importUser(?, ?, ?, ?, ?, ?)';
const dbimport_macs = 'importMac(?, ?, ?)';

// Names of functions on the server (https requests)
const simport_users = 'importUsers';
const simport_macs = 'importMacs';
const simport_logs = 'importLogs';

/*
	--- Function for exporting data from the local database.
	- return value: Promise for the exported instances
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
	--- Function for importing data importing data into the local database.
*/
async function dbimport(procedure, instances) {
	console.log('  >   Importing into database:', procedure, ' ...');
	return new Promise( (resolve, reject) => {
		var call = 'CALL ' + procedure;
		var num = 0;
		instances.forEach( instance => {
			con.query(call, instance, (err, result) => {
			})
			if (++num == instances.length)
				resolve()
		})
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


module.exports = {
	synchronize: async function () {
		var ready = new Promise( (resolve, reject) => {
			if (local_mac != null) {
				resolve();
			} else {
				exec("ifconfig eth0 | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}'", (err, stdout, stderr) => {
					if (err)
						reject('local_mac')
					else
						resolve(stdout)
				})
			}
		})
		.then( stdout => {
			local_mac = stdout;
			console.log('--------------------------');
			console.log('----- Communication started.');
			return Promise.race([
				sendRequest('ping', null),
				new Promise( (resolve, reject) => setTimeout(reject, 10000, 'timeout'))
			])
		})
		
		var macs_sent = ready
		.then( () => {
			console.log('----- Connection established.');
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
		
		var macs_imported = macs_sent
		.then( macs => {
			console.log('----- MACs sent to server. New MACs received:');
			console.log(macs);
			return dbimport(dbimport_macs, macs)
		})
		.then( () => console.log('----- MACs imported into database.'))
		
		var logs_exported = ready
		.then( () => dbexport(dbexport_logs) )
		
		var logs_sent = Promise.all([logs_exported, macs_sent])
		.then( values => {
			var logs = values[0];
			console.log('----- Logs exported from database:');
			console.log(logs);
			return sendRequest(simport_logs, logs)
		})
		.then( () => console.log('----- Logs sent to server.'))
		
		return Promise.all([macs_imported, logs_sent])
		.then( () => {
			return Promise.resolve()
		}, err => {
			return Promise.reject(err)
		})
	},
	synchronize_periodically: async function(period) {
		synchronize()
		.then( () => {
			console.log('Synchronization successful.');
			setTimeout( () => synchronize_periodically(period), period);
		}, err => {
			console.log('Synchronization failed. Attempting again in', period / 100000, 'seconds');
			setTimeout( () => synchronize_periodically(period), period / 100);
		})
	}
}
