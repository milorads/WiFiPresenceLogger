import { findTarget, performScript } from './util'

import { database } from './database'

import { LogManager } from './info-log'
const logs = new LogManager(__filename)

const clientRegistrationCheck = async ipv6 => {
	
	const name = this.clientRegistrationCheck.name
	const ip = ipv6.replace(/^.*:/, '')
	logs.info(name, `IP: ${ip}`)

	logs.trace(name, 'Fetching ARP table...')
	const arp = (await performScript('arp -a | grep "wlan0"'))
		.split('\n')
	
	logs.trace(name, 'Searching for MAC in ARP table...')
	const mac = await findTarget(arp, ip, unparsedRow => {
		const row = unparsedRow.split(' ')
		const ipFromArp = row[1].replace('(','').replace(')','')
		const mac = row[3]

		logs.info(name, `\tIP: ${ipFromArp}, MAC: ${mac}`)
		return ipFromArp
	})

	const users = await database.query('CALL getUser_byMac(?)', [mac])
	
	logs.trace(name, (users.length > 0) ? 'Registered' : 'Not registered')
	return [mac, (users.length > 0) ? users[0] : null]
}

const insUpdRecord = async (name, surname, id, mac, type, service) => {
	
	const name = this.insUpdRecord.name
	logs.trace(name, 'Performing record update')

	const sql =
		service == 'new' ? (
			type == 's' ? 'CALL insertStudent(?, ?, ?, ?)' :
			type == 'p' ? 'CALL insertProfessor(?, ?, ?, ?)' :
			''
		) :
		service == 'edit' ? 'CALL updateUser(?, ?, ?, ?)' :
		''
	
	const vars =
		service == 'new' ? [name, surname, id, mac] :
		service == 'edit' ? [mac, name, surname, id] :
		[]
	
	return database.query(sql, vars)
}

const getRecord = async mac => {
	
	const name = this.getRecord.name
	logs.trace(name, 'Getting user')
	return database.query('CALL getUser_byMac(?)', [mac])
}

export {
	clientRegistrationCheck,
	insUpdRecord,
	getRecord
}
