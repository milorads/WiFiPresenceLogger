const express = require('express');

var dbFun = require('../dbFunctions')
var session = require('express-session');

//definsianje timeout-a sesije jednog klijenta
var timeoutTime = 120000;

//definisanje instance router
const router = express.Router();

//setovanje session funkcionalnosti u objektu router
router.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

/* Root Get metoda - poziva se prilikom pristupa home stranici aplikacije (http://192.168.4.1 ili http://prijava.prisustva) */
/* Proverava da li je klijent koji je poslao zahtev za stranicom registrovan ili ne */
/* Ako je registrovan, Prikazuje mu njegove unete podatke i opciju za izmenu tih podataka */
/* Ako ne, interfejs za unos podataka radi registracije */
router.get('/', function (req, res) {
	
	//Provera registracije klijenta
	dbFun.clientRegistrationCheck(req.connection.remoteAddress,function(result){
		if(result[0] != "undefined")
		{
			//Pamcenje mac adrese klijenta u memoriji njegove sesije
			req.session.mac = result[0];
			console.log("session.mac: " + req.session.mac);
			// Nije registrovan: renderuje se dinamicka stranica za biranje Tipa korisnika (student ili profesor)
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
			// Registrovan: renderuje se stranica sa podacima o korisniku i opcija za editovanje
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
					req.session.type = resArr[3];
					res.render('message',{
						text1: res2,
						option1: 'edit',
						link1 : 'edit'
					});
				});
			}
			//U slucaju nedefinisanog klijenta, renderuje se stranica saporukom o gresci i ponovnom ucitavanju pocetne stranice
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
		//greska zbog nedefinisane Mac adrese, greska u ARP tabeli (Nema mrezne konekcije izmedju Default Gateway-a i Klijenta)
		//renderuje se stranica sa porukom o gresci
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

/* Get Metoda /student-registration - registracija studenta, renderuje se stranica sa formom za unos podataka studenta */
router.get('/student-registration', function (req, res) {
	
	req.session.type = "student";
	req.session.service = "new";
	res.render('studentForm', { 
		title: 'Registracija studenta',
		indexplc1: 'Index'
	});
});
/* Get Metoda /profesor-registration - registracija profesora, renderuje se stranica sa formom za unos podataka profesora */
router.get('/profesor-registration', function (req, res) {
	req.session.type = "profesor";
	req.session.service = "new";
	res.render('studentForm', { 
		title: 'Registracija profesora',
		indexplc1: 'Indetifikacioni broj'
	});
});

/* Get Metoda /edit - Izmena postojeceg registrovanog korisnika*/
router.get('/edit', function(req,res){
	//ako je istekla sesija, renderuje se poruka o tome i opcija za povratak na pocetnu stranu
	if(typeof req.session.name == 'undefined')
	{
		res.render('message',{
			text1: 'istekla je vasa sesija, vratite se na pocetnu stranu',
			option1: 'povratak na pocetnu stranu',
			link1: '/'
		});
	}
	//pamti se radnja o editovanju u sesiji
	req.session.service = "edit";
	var plcIndexStr = "";
	if(req.session.type == 'student')
		plcIndexStr = "Index";
	else
		plcIndexStr = "Indetifikacioni broj";
	
	//renderuje se forma za unos podataka, sa vec unetim podacima koji se menjaju
	res.render('studentForm',{
		namep: req.session.name.toString(),
		surnamep: req.session.surname.toString(),
		indexp: req.session.index.toString(),
		option1: 'submit',
		link1: 'submit',
		indexplc1: plcIndexStr
	});
});

/* Post Metoda - /submit Funkcija za upis unetih podataka sa forme u bazu*/
router.post('/submit', function (req, res) {
	
	//ako je istekla sesija, renderuje se poruka kao odgovor korisniku o tome
	if((typeof req.session.name == 'undefined') && (typeof req.session.service == 'undefined'))
	{
		res.render('message',{
			text1: 'istekla je vasa sesija, vratite se na pocetnu stranu',
			option1: 'povratak na pocetnu stranu',
			link1: '/'
		})
	}
	else
	{
		//Unos podataka u sesiju
		req.session.name = req.body.name;
		req.session.surname = req.body.surname;
		req.session.index = req.body.index;
		
		//poziv funkcije za unos podataka u bazu
		dbFun.insUpdRecord(req.session.name,req.session.surname,req.session.index,req.session.mac,req.session.type,req.session.service,function(reslt){
			if(reslt == "success")
			{
				//ako je unos uspesan, renderuje se stranica sa novim unetim podacima
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
				//u slucaju greske pri unosu, renderuje se poruka o greski
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
