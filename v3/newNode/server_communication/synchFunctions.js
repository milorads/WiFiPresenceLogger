var mysql = require('mysql')

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'wifi_presence_logger_logs'
});

module.exports = {
	exportUsers: function (callback) {
		con.query('CALL exportUsers', (err, result) => {
			if (err) {
				callback('DB query error [' + err.message + ']');
			} else {
				callback(null, result);
			}
		})
	}
}
