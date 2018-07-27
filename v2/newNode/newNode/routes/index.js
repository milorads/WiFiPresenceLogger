const express = require('express');
const router = express.Router();
var dbFun = require('../dbFunctions')
var session = require('express-session');
var timeoutTime = 120000;
router.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

router.get('/', function (req, res) {
	
	//var result = dbFun.clientRegistrationCheck(req.connection.remoteAddress);
	dbFun.clientRegistrationCheck(req.connection.remoteAddress,function(result){
		if(result[0] != "undefined")
		{
			//req.session.cookie.maxAge = timeoutTime;
			req.session.mac = result[0];
			console.log("session.mac: " + req.session.mac);
			if(result[1] === "ne_postoji")
			{
				console.log("ne postoji");
				res.render('index', { 
					title: 'Tip korisnika', 
					option1: 'Student', 
					option2: 'Profesor',
					link1: '/student-registration',
					link2: '/profesor-registration'
				})		
			}
			else if(result[1] === "postoji")
			{
				console.log("sada ne puca ;)");
				console.log("postoji");
				//funkcija koja u session stavlja podatke o korisniku
				//ako nema podataka u session, dodajemo ih iz baze
				dbFun.getRecord(result[0],function(res2){
					var resArr = res2.toString().split(",");
					console.log("<<" + resArr[0] + "|" + resArr[1] + ">>")
					req.session.name = resArr[0];
					req.session.surname = resArr[1];
					req.session.index = resArr[2];
					res.render('message',{
						text1: res2,
						option1: 'edit',
						link1 : 'edit'
					});
				});
			}
			else
			{
				delete req.session.mac;
				res.render('message',{
					text1: "Greska u bazi podataka",
					option1: 'Povratak na pocetnu stranicu',
					link1: '/'
				});
			}
		}
		else
		{
			res.render('message',{
				text1: "Greska, proverite konekciju",
				option1: 'Povratak na pocetnu stranicu',
				link1: '/'
			})
		}
	});
});
router.get('/student-registration', function (req, res) {
	
	req.session.type = "student";
	req.session.service = "new";
	res.render('studentForm', { 
		title: 'Registracija studenta',
	});
});
router.get('/profesor-registration', function (req, res) {
	req.session.type = "profesor";
	req.session.service = "new";
	res.render('studentForm', { 
		title: 'Registracija profesora'
	});
});
router.get('/edit', function(req,res){
	if(typeof req.session.name == 'undefined')
	{
		res.render('message',{
			text1: 'istekla je vasa sesija, vratite se na pocetnu stranu',
			option1: 'povratak na pocetnu stranu',
			link1: '/'
		});
	}
	req.session.service = "edit";
	res.render('studentForm',{
		namep: req.session.name.toString(),
		surnamep: req.session.surname.toString(),
		indexp: req.session.index.toString(),
		option1: 'submit',
		link1: 'submit'
	});
});
router.post('/submit', function (req, res) {
	if(typeof req.session.name == 'undefined')
	{
		res.render('message',{
			text1: 'istekla je vasa sesija, vratite se na pocetnu stranu',
			option1: 'povratak na pocetnu stranu',
			link1: '/'
		})
	}
	else
	{
		req.session.name = req.body.name;
		req.session.surname = req.body.surname;
		req.session.index = req.body.index;
		dbFun.insUpdRecord(req.session.name,req.session.surname,req.session.index,req.session.mac,req.session.type,req.session.service,function(reslt){
			if(reslt == "success")
			{
				var str = "Ulogovani ste kao:" + req.session.name + " " + req.session.surname + ", " + req.session.index;
				console.log("success");
				console.log(str);
				res.render('message',{
					text1: str,
					option1: 'povratak na pocetnu stranicu',
					link1: '/'
				});
			}
			else
			{
				console.log("somthing else");
				res.render('message',{
					text1: reslt,
					option1: 'pocetak',
					link1: '/'
				});
			}
		});
	}
});

module.exports = router;
