var http = require('http');
var request = require('request');
var mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'wifi_presence_logger_logs'
});

var url = 'http://168.63.6.115:80/';

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
		await instances.forEach( instance => {
			con.query(call, instance, (err, result) => {
			})
		})
		resolve()
	})
}
async function sendRequest(req_name, instances) {
	console.log('  >   Requesting from server:', req_name, ' ...');
	return new Promise( (resolve, reject) => {
		request.post(url + req_name, {
			json: {
				token: 'ok',
				mac: 'lmac',
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
	synchronize = async function () {
		console.log('---------------------------');
		console.log('----- Communication started.');
		
		var macs_sent =
		dbexport(dbexport_users)
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
		
		var logs_sent = Promise.all([dbexport(dbexport_logs), macs_sent])
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
	}
}
