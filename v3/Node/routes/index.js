const express = require('express');
const router = express.Router();
var dbFun = require('../dbFunctions')
var session = require('express-session');
var timeoutTime = 120000;
router.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

router.get('/', function (req, res) {
	dbFun.clientRegistrationCheck(req.connection.remoteAddress)
	.then( data => {
		console.log(data);
		req.session.mac = data[0];
		var record = data[1];
		
		if (record != null) {
			console.log('User exists');

			/* if session is empty, put data from DB */

			console.log("<<" + record.name + "|" + record.surname + ">>");
			req.session.name = record.name;
			req.session.surname = record.surname;
			req.session.index = record.id;
			req.session.type = record.type;
			res.render('message', {
				text1: record.name + ' ' + record.surname + ', ' + record.type + ', ' + record.id,
				option1: 'edit',
				link1 : 'edit'
			})
		} else {
			console.log('User does not exist');
			res.render('index', {
				title: 'Tip korisnika',
				option1: 'Student',
				option2: 'Profesor',
				link1: '/student-registration',
				link2: '/profesor-registration'
			})
		}
	}, err => {
		console.log('Request failed');
		console.log(err);
	})
});
router.get('/student-registration', function (req, res) {
	req.session.type = 's';
	req.session.service = 'new';
	res.render('studentForm', {
		title: 'Registracija studenta',
		indexplc1: 'Index'
	});
});
router.get('/profesor-registration', function (req, res) {
	req.session.type = 'p';
	req.session.service = 'new';
	res.render('studentForm', {
		title: 'Registracija profesora',
		indexplc1: 'Indetifikacioni broj'
	});
});
router.get('/edit', function (req,res) {
	if (typeof req.session.name == 'undefined') {
		res.render('message', {
			text1: 'istekla je vasa sesija, vratite se na pocetnu stranu',
			option1: 'povratak na pocetnu stranu',
			link1: '/'
		});
	}
	var plcIndexStr = "";
	if (req.session.type == 's')
		plcIndexStr = "Index";
	else
		plcIndexStr = 'Identifikacioni broj';
	
	req.session.service = 'edit';
	res.render('studentForm', {
		namep: req.session.name.toString(),
		surnamep: req.session.surname.toString(),
		indexp: req.session.index.toString(),
		option1: 'submit',
		link1: 'submit',
		indexplc1: plcIndexStr
	});
});
router.post('/submit', function (req, res) {
	if ((typeof req.session.name == 'undefined') && (typeof req.session.service == 'undefined')) {
		res.render('message', {
			text1: 'istekla je vasa sesija, vratite se na pocetnu stranu',
			option1: 'povratak na pocetnu stranu',
			link1: '/'
		})
	} else {
		if (req.body.name != '') {
			req.session.name = req.body.name;
		} else {
			req.body.name = null;
		} if (req.body.surname != '') {
			req.session.surname = req.body.surname;
		} else {
			req.body.surname = null;
		} if (req.body.index != '') {
			req.session.index = req.body.index;
		} else {
			req.body.index = null;
		}
		
		dbFun.insUpdRecord(req.session.name, req.session.surname, req.session.index, req.session.mac, req.session.type, req.session.service)
		.then( msg => {
			var str = 'Ulogovani ste kao: ' + req.session.name + ' ' + req.session.surname + ', ' + req.session.type + ': ' + req.session.index;
			console.log(msg);
			console.log(str);
			
			res.render('message', {
				text1: str,
				option1: 'povratak na pocetnu stranicu',
				link1: '/'
			});
		}, err => {
			console.log(err);
			res.render('message', {
				text1: err,
				option1: 'pocetak',
				link1: '/'
			})
		})
	}
});

module.exports = router;
