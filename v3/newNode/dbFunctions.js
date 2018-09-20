var exec = require('child_process').exec;
var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "root",
	database: "wifi_presence_logger_logs"
});


module.exports = {
	clientRegistrationCheck: function (ipv6, callback) {
		var ip = ipv6.replace(/^.*:/, '')
		console.log(ip);
		var tableName = getDateTableName();
		var arp_ip;
		var mac = 'undefined';
		
		exec('arp -a | grep "wlan0"', function (error, stdout, stderr) {
			if (error) {
				callback([mac, 'Greska prilikom dohvatanja ARP tabele [' + console.error(err.message) + ']']);
			} else {
				parsedStdout = stdout.split('\n');
				for (key = 0; key < parsedStdout.length - 1; key++) {
					parsedRow = parsedStdout[key].split(' ');
					arp_ip = parsedRow[1].replace('(','').replace(')','');
					console.log('arp_ip:', arp_ip, 'mac:', parsedRow[3]);
					
					if(arp_ip == ip) {
						mac = parsedRow[3];
					}
				}
				if(mac == 'undefined') {
					console.log('uredjaj sa zadatom ip adresom ne postoji u arp tabeli');
					callback([mac, 'Greska: Uredjaj sa zadatom ip adresom ne postoji u arp listi']);
				} else {
					console.log(mac);
					con.query('CALL getUser_byMac(?)', [mac], (err, result) => {
						if (err) {
							callback([mac, 'Greska prilikom pristupa bazi [', console.error(err.message) + ']']);
						} else if (result.length == 0) {
							console.log('ne postoji ova mac adresa u bazi, sledi upis');
							callback([mac, 'ne_postoji']);
						} else {
							console.log('vec postoji mac adresa u regList tabeli');
							callback([mac, 'postoji']);
						}
					})
				}
			}
		})
	},
	insUpdRecord: function (name, surname, id, mac, type, service, callback) {
		if (service == 'new') {
			if (type == 's') {
				con.query('CALL insertStudent(?, ?, ?, ?)', [name, surname, id, mac], (err, result) => {
					if (err) {
						callback('Greska prilikom upisa podataka u bazu [' + console.log(err.message) + ']');
					} else {
						console.log('Upis novog korisnika zavrsen');
						callback('success');
					}
				})
			} else if (type == 'p') {
				con.query('CALL insertProffessor(?, ?, ?, ?)', [name, surname, id, mac], (err, result) => {
					if (err) {
						callback('Greska prilikom upisa podataka u bazu [' + console.log(err.message) + ']');
					} else {
						console.log('Upis novog korisnika zavrsen');
						callback('success');
					}
				})
			}
		} else if (service == 'edit') {
			con.query('CALL updateUser(?, ?, ?, ?)', [mac, name, surname, id], (err, result) => {
				if (err) {
					callback('Greska prilikom azuriranja podataka [' + console.error(err.message) + ']');
				} else {
					callback('success');
				}
			})
		}
	},
	getRecord: function (mac, callback) {
		con.query('CALL getUser_byMac(?)', [mac], (err, result) => {
			if (err) {
				callback('Greska prilikom pristupa bazi [' + console.error(err.message) + ']');
			} else {
				callback([result[0].name, result[0].surname, result[0].id, result[0].type]);
			}
		})
		//treba dodati join za tim korisnika
	}
}
