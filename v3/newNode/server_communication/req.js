var http = require('http');
var request = require('request');
var mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'wifi_presence_logger_logs'
})

var url = 'http://168.63.6.115:80';

async function dbexport(proc_signature) {
	console.log('  >   Exporting from database:', proc_signature, ' ...')
	return new Promise( (resolve, reject) => {
		con.query('CALL ' + proc_signature, (err, result) => {
			if (err)
				reject(err)
			else
				resolve(result[0])
		})
	})
}
async function dbimport(proc_signature, instances) {
	console.log('  >   Importing into database:', proc_signature, ' ...')
	return new Promise( (resolve, reject) => {
		var call = 'CALL ' + proc_signature;
		await instances.forEach( instance => {
			con.query(call, instance, (err, result) => {
			})
		})
		resolve()
	})
}
async function sendRequest(proc_signature, instances) {
	console.log('  >   Requesting from server:', proc_signature, ' ...')
	return new Promise( (resolve, reject) => {
		request.post(url + '/' + proc_signature, {
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
		
		var exportedLogs = dbexport('exportLogs');
		var exportedUsers = dbexport('exportUsers');
		
		var sentMacs = exportedUsers
		.then( users => {
			console.log('----- Users exported from database:');
			console.log(users);
			return sendRequest('importUsers', users)
		})
		.then( users => {
			console.log('----- Users sent to server. New users received:');
			console.log(users);
			return dbimport('importUser(?, ?, ?, ?, ?, ?)', users)
		})
		.then( () => {
			console.log('----- Users imported into database.');
			return dbexport('exportMacs')
		})
		.then( macs => {
			console.log('----- MACs exported from database:');
			console.log(macs);
			return sendRequest('importMacs', macs)
		})
		sentMacs
		.then( macs => {
			console.log('----- MACs sent to server. New MACs received:');
			console.log(macs);
			return dbimport('importMacs(?, ?, ?)', macs)
		})
		.then( () => console.log('----- MACs imported into database.'))
		
		Promise.all([exportedLogs, sentMacs])
		.then( values => {
			var logs = values[0];
			console.log('----- Logs exported from database:');
			console.log(logs);
			return sendRequest('importLogs', logs)
		})
		.then( () => console.log('----- Communication complete!'))
	}
}
