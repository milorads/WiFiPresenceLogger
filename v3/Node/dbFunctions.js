var exec = require('child_process').exec;
var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "wifi_presence_logger_logs"
});


module.exports = {
	clientRegistrationCheck: async function (ipv6) {
		var ip;
		return Promise.resolve()
		.then( () => {
			ip = ipv6.replace(/^.*:/, '');
			console.log(ip);
			
			return new Promise( (resolve, reject) => {
				exec('arp -a | grep "wlan0"', (err, stdout, stderr) => {
					if (err) {
						reject('Greska prilikom dohvatanja ARP tabele [' + err.message + ']')
					} else {
						resolve(stdout)
					}
				})
			})
		})
		.then( stdout => {
			var parsed_stdout = stdout.split('\n');
			var arp_ip;
			var other_macs = 0;
			
			return new Promise( (resolve, reject) => {
				parsed_stdout.forEach( row => {
					var parsed_row = row.split(' ');
					arp_ip = parsed_row[1].replace('(','').replace(')','');
					console.log('arp_ip:', arp_ip, 'mac:', parsed_row[3]);
					
					if (arp_ip == ip) {
						resolve(parsed_row[3])
					} else if (++other_macs == parsed_stdout) {
						reject('Uredjaj sa zadatom ip adresom ne postoji u arp listi')
					}
				})
			})
		})
		.then( mac => {
			console.log('Odgovarajuci MAC:', mac);
			return new Promise( (resolve, reject) => {
				con.query('CALL getUser_byMac(?)', [mac], (err, result) => {
					if (err)
						reject('Greska prilikom pristupa bazi [', err.message + ']')
					else if (result[0].length == 0) {
						console.log('no');
						resolve([mac, null])
					} else {
						console.log('si');
						resolve([mac, result[0][0]])
					}
				})
			})
		})
	},
	insUpdRecord: async function (name, surname, id, mac, type, service) {
		return new Promise( (resolve, reject) => {
			if (service == 'new') {
				if (type == 's') {
					con.query('CALL insertStudent(?, ?, ?, ?)', [name, surname, id, mac], (err, result) => {
						if (err)
							reject('Greska prilikom upisa novog studenta u bazu [' + err.message + ']')
						else
							resolve('Novi student upisan u bazu')
					})
				} else if (type == 'p') {
					con.query('CALL insertProfessor(?, ?, ?, ?)', [name, surname, id, mac], (err, result) => {
						if (err)
							reject('Greska prilikom upisa novog profesora u bazu [' + err.message + ']')
						else
							resolve('Novi profesor upisan u bazu')
					})
				}
			} else if (service == 'edit') {
				con.query('CALL updateUser(?, ?, ?, ?)', [mac, name, surname, id], (err, result) => {
					if (err)
						reject('Greska prilikom azuriranja korisnika [' + err.message + ']')
					else
						resolve('Korisnik azuriran')
				})
			}
		})
	},
	getRecord: async function (mac) {
		return new Promise( (resolve, reject) => {
			con.query('CALL getUser_byMac(?)', [mac], (err, result) => {
				if (err)
					reject('Greska prilikom pristupa bazi [' + err.message + ']')
				else
					resolve(result[0]);
			})
		})
		//treba dodati join za tim korisnika
	}
}
