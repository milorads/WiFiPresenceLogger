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


new Promise( (resolve, reject) => {
	console.log('---------------------------');
	console.log('----- Communication started.');
	console.log('  >   Exporting users from database...');
	
	con.query('CALL exportUsers', (err, result) => {
		if (err)
			reject(err);
		else
			resolve(result[0]);
	})
})
.then( users => {
	console.log('----- Users exported from database:');
	console.log(users);
	console.log('  >   Sending to server...');
	
	return new Promise( (resolve, reject) => {
		request.post(url + '/importUsers',
			{
				json: {
					token: 'ok',
					mac: 'lmac',
					rows: users
				}
			}, function (err, response, body) {
				if (err)
					reject(err);
				else
					resolve(body);
		})
	})
})
.then( users => {
	console.log('----- Users sent to server. New users received.');
	console.log('  >   Importing new users into database...');
	
	return new Promise( (resolve, reject) => {
		users.forEach( row => {
			con.query('CALL importUser(?, ?, ?, ?, ?, ?)', row, (err, result) => {
			})
		})
		resolve();
	})
})
.then( () => {
	console.log('----- Users imported into database.');
	console.log('  >   Exporting MACs from database...');
	
	return new Promise( (resolve, reject) => {
		con.query('CALL exportMacs', (err, result) => {
			if (err)
				reject(err);
			else
				resolve(result[0]);
		})
	})
})
.then( macs => {
	console.log('----- MACs exported from database.');
	console.log('  >   Sending to server...');
	
	return new Promise( (resolve, reject) => {
		request.post(url + '/importMacs',
			{
				json: {
					token: 'ok',
					mac: 'lmac',
					rows: macs
				}
			}, function (err, response, body) {
				if (err)
					reject(err);
				else
					resolve(body);
		})
	})
})
.then( macs => {
	console.log('----- MACs sent to server. New MACs received.');
	console.log('  >   Importing new MACs into database...');
	
	return new Promise( (resolve, reject) => {
		macs.forEach( row => {
			con.query('CALL importMacs(?, ?, ?)', row, (err, result) => {
			})
		})
		resolve();
	})
})
.then( () => {
	console.log('----- MACs imported into database.');
	console.log('  >   Exporting logs from database...');
	
	return new Promise( (resolve, reject) => {
		con.query('CALL exportLogs', (err, result) => {
			if (err)
				reject(err);
			else
				resolve(result[0]);
		})
	})
})
.then( logs => {
	console.log('----- Logs exported from database.');
	console.log('  >   Sending to server...');
	
	return new Promise( (resolve, reject) => {
		request.post(url + '/importLogs',
			{
				json: {
					token: 'ok',
					mac: 'lmac',
					rows: logs
				}
			}, function (err, response, body) {
				if (err)
					reject(err);
				else
					resolve();
		})
	})
})
.then( () => {
	console.log('----- Communication complete!');
})
.catch( err => {
	console.log('----- Communication failed.');
	console.log('      Error:', err.message);
})
