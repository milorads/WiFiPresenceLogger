import { get, forEachResolve, performScript } from '../util'

import { Router } from 'express'
const router = Router()

import { database } from '../database'

import { LogManager } from '../info-log'
const logs = new LogManager(__filename)

import { TokenManager } from '../token-manager'
const tokens = new TokenManager()

// TODO should be replaced with a better form of authentication
const deviceCode = 'bfa86fdd-398c-462e-9b4e-9cb52ffafb58'

Promise.prototype.respond = res => {
	const name = 'Prototype.respond'

	this
	.then( data => {
		logs.info(name, 'Request completed')
		res.setHeader('error', 'ok')
		res.end(data)
	}, err => {
		logs.error(name, 'Request failed')
		res.setHeader('error', err)
		res.end()
	})
	.then(
		() => logs.info(name, 'Response sent'),
		err => logs.error(name, 'Response sending failed', err.message)
	)
}

// Current version - device's main password is its MAC address
//
const checkUser = async (username, password) => {
	
	const name = checkUser.name
	logs.trace(`Checking user: ${username}`)

	if (password == deviceCode) {
		logs.info(name, 'User authenticated')
		return
	} else {
		logs.error(name, 'User authentication failed')
		throw 'pass'
	}
}

router.post('/getToken', (req, res) => {
	
	const name = '/getToken'
	logs.trace(name, 'Request: get token')
	
	Promise.resolve()
	.then( () =>
		checkUser(get(req, 'usr'), get(req, 'pass'))
	)
	.then( () =>
		tokens.generate(get(req, 'usr'))
	)
	.respond(res)
});

const apiTest = async () => '1'

router.post('/apiTest', (req, res) => {
	
	const name = '/apiTest'
	logs.trace(name, 'Request: API test')
	
	tokens.authenticateRequest(req, res)
	.then(apiTest)
	.respond(res)
})

const getData = async datum => {
	
	if (datum == null) throw 'parameters'

	const name = getData.name
	logs.trace(name, `Data: ${datum}`)
	
	return database.query('CALL getLogs_byDate(?)', [datum])
	.then( async rows => {
		let res = ''

		await forEachResolve(rows, row => res +=
			`${row.type}|${row.name}|${row.surname}|${row.id}|${row.mac}|${row.stime}|${row.etime};`
		)
		
		logs.info(name, `Final result: ${res}`)
		return res.substring(0, res.length - 1)
	})
}

router.post('/getData', (req, res) => {
	
	const name = '/getData'
	logs.trace(name, 'Request: get data')
	
	tokens.authenticateRequest(req, res)
	.then( () =>
		getData(get(req, 'file'))
	)
	.respond(res)
})

const getData1 = async datum => {

	if (datum == null) throw 'parameters'
	
	const name = getData1.name
	logs.trace(name, `Data: ${datum}`)
	
	return database.query('CALL getLogs_byDate(?)')
	.then( async rows => {
		let res = ''

		await forEachResolve(rows, row => res +=
			`${row.type}|${row.name}|${row.surname}|${row.id}|${row.mac}|${row.stime}|${row.etime};`
		)
		
		logs.info(name, `Final result: ${res}`)
		return res.substring(0, res.length - 1)
	})
}

router.post('/getData1', (req, res) => {
	
	const name = '/getData1'
	logs.trace(name, 'Request: Get data 1')
	
	tokens.authenticateRequest(req, res)
	.then( () =>
		getData1(get(req, 'file'))
	)
	.respond(res)
})

const deleteData = async dates => {

	if (dates == null) throw 'parameters'
	
	const name = deleteData.name
	logs.trace(name, 'Deleting data...')

	const datesList = dates.split(',')
	logs.info(`Dates: ${datesList}`)

	datesList.forEach( date =>
		database.query('CALL deleteLogs_byDate(?)', [date])
	)
}

router.post('/deleteData', (req, res) => {
	
	const name = '/deleteData'
	logs.trace(name, 'Request: delete data')
	
	tokens.authenticateRequest(req, res)
	.then( () =>
		deleteData(get(req, 'file'))
	)
	.respond(res)
})

const listData = async () => {
	
	const name = listData.name
	const tabels = `SELECT * FROM sqlite_master WHERE type='table'`
	
	return new Promise( (resolve, reject) =>
		LogBase.all(tabels, (err, row) => {
			if (err) {
				logs.error(name, 'LogBase error', err.message)
				reject('LogBase error')
			} else {
				logs.info(name, `LogBase result: ${row}`)

				let res = ''
				await forEachResolve(row, instance => res += `${instance.name};` )
				resolve(res.substring(0, res.length - 1))
			}
		})
	)
}

router.post('/listData', (req, res) => {
	
	const name = '/listData'
	logs.trace(name, 'Request: list data')
	
	tokens.authenticateRequest(req, res)
	.then(listData)
	.respond(res)
})

router.get('/getTimestamp', (req, res) => {
	
	const name = '/getTimestamp'
	logs.trace(name, 'Request: get timestamp')

	try {
		tStamp = new Date().toISOString().replace(/\..+/,'')
		res.end(tStamp)
		logs.trace(name, 'Response sent')
	} catch (err) {
		logs.error(name, 'Response sending failed', err.message)
	}
});

const getTimeShift = async () => {
	
	const name = getTimeShift.name

	try {
		const output = (await performScript(
			"date +'%Y-%m-%dT%H:%M:%S' && i2cdump -r 0-6 -y 1 0x68 b | grep 00:"
		)).split('\n')

		const systemTime = new Date(output[0])
		logs.info(name, `System time: ${systemTime}`)

		const rtc = output[1].split(' ')
		const rtcTime = new Date(`20${rtc[7]}-${rtc[6]}-${rtc[5]}T${rtc[3]}:${rtc[2]}:${rtc[1]}`)
		logs.info(name, `RTC time: ${rtcTime}`)

		const timeShift = (systemTime - rtcTime) / 1000
		logs.info(name, `Time shift: ${timeShift}`)

		return String(timeShift)
	
	} catch (err) {
		throw (typeof err === 'string') ? err : err.message
	}
}

router.post('/getTimeShift', (req, res) => {
	
	const name = '/getTimeShift'
	logs.trace(name, 'Request: get time shift')
	
	tokens.authenticateRequest(req, res)
	.then(getTimeShift)
	.respond(res)
})

const setSystemTime = async (actionCode, adminTimestamp) => performScript(

	`sudo bash ${__dirname}/../../Bash/sys_time.bash ${actionCode} ${adminTimestamp}`
)

router.post('/setSystemTime', (req, res) => {
	
	const name = '/setSystemTime'
	logs.trace(name, 'Request: set system time')
	
	tokens.authenticateRequest(req, res)
	.then( () => {
		const actionCode = get(req, 'actionCode')
		const adminTimestamp = get(req, 'adminTimestamp')

		return (actionCode == null || adminTimestamp == null) ?
			Promise.reject('parameters') :
			setSystemTime(actionCode, adminTimestamp)
	})
	.respond(res)
})

const getRegList = async () => {
	
	const name = getRegList.name
	
	return database.query('CALL getLogs')
	.then( async rows => {
		let res = ''

		await forEachResolve(rows, row => res +=
			`${row.type}|${row.name}|${row.surname}|${row.id}|${row.mac}|${row.stime}|${row.etime};`
		)
		
		logs.info(name, `Final result: ${res}`)
		return res.substring(0, res.length - 1)
	})
}

router.post('/getRegList', (req, res) => {
	
	const name = '/getRegList'
	logs.trace(name, 'Request: get reg list')
	
	tokens.authenticateRequest(req, res)
	.then(getRegList)
	.respond(res)
});


export default router
