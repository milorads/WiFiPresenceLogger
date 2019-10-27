import { Router } from 'express'
const router = Router()

import session from 'express-session'

import { clientRegistrationCheck, insUpdRecord } from '../dbFunctions'

import { LogManager } from '../info-log'
const logs = new LogManager(__filename)

router.use(session( { secret: 'keyboard cat', cookie: { maxAge: 60000 } }))

router.get('/', (req, res) => {
	
	const name = '/default'

	clientRegistrationCheck(req.connection.remoteAddress)
	.then( data => {
		logs.trace(name, data)
		req.session.mac = data[0]
		let record = data[1]
		
		if (record != null) {
			// if session is empty, put data from DB

			logs.info(name, `User: ${record.name} | ${record.surname}`)

			req.session.name = record.name
			req.session.surname = record.surname
			req.session.index = record.id
			req.session.type = record.type

			res.render('message', {
				text1: record.name + ' ' + record.surname + ', ' + record.type + ', ' + record.id,
				option1: 'edit',
				link1 : 'edit'
			})
		} else {
			logs.info(name, 'User does not exist')

			res.render('index', {
				title: 'Tip korisnika',
				option1: 'Student',
				option2: 'Profesor',
				link1: '/student-registration',
				link2: '/profesor-registration'
			})
		}
	})
});

router.get('/student-registration', (req, res) => {
	req.session.type = 's';
	req.session.service = 'new';
	res.render('studentForm', {
		title: 'Registracija studenta',
		indexplc1: 'Index'
	});
});

router.get('/profesor-registration', (req, res) => {
	req.session.type = 'p';
	req.session.service = 'new';
	res.render('studentForm', {
		title: 'Registracija profesora',
		indexplc1: 'Indetifikacioni broj'
	});
});

router.get('/edit', (req, res) => {
	if (typeof req.session.name == 'undefined') {
		res.render('message', {
			text1: 'istekla je vasa sesija, vratite se na pocetnu stranu',
			option1: 'povratak na pocetnu stranu',
			link1: '/'
		});
	}

	let idText = req.session.type == 's' ?
		'Index' :
		'Identifikacioni broj'
	
	req.session.service = 'edit';
	res.render('studentForm', {
		namep: req.session.name.toString(),
		surnamep: req.session.surname.toString(),
		indexp: req.session.index.toString(),
		option1: 'submit',
		link1: 'submit',
		indexplc1: idText
	})
})

router.post('/submit', (req, res) => {
	const name = '/submit'

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

		let session = req.session
		insUpdRecord(session.name, session.surname, session.index,
			session.mac, session.type, session.service
		)
		.then( () => {
			var message =
				`Ulogovani ste kao: ${session.name} ${session.surname}, ` +
				`${session.type}: ${session.index}`
			logs.info(name, message)
			
			res.render('message', {
				text1: message,
				option1: 'povratak na pocetnu stranicu',
				link1: '/'
			});
		}, () => {
			res.render('message', {
				text1: err,
				option1: 'pocetak',
				link1: '/'
			})
		})
	}
});


export default router
