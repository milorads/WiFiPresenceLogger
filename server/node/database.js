import { createConnection } from 'mysql'
import { LogManager } from './info-log'

const logs = new LogManager(__filename)

class Database {
    
    constructor () {
        this.connection = createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'wifi_presence_logger'
        })
    }

    query = async (sql, args) => {

        const name = 'Database.query'
        logs.trace(name, `Performing query: ${sql}`)
        
        return new Promise( (resolve, reject) =>
            this.connection.query(sql, args, (err, result) => {
                if (err) {
                    logs.error(name, 'Query', err.message)
                    reject('Query')
                } else {
                    logs.trace(name, 'Query successful', result[0])
                    resolve(result[0])
                }
            })
        )
    }

    close = async () => {

        const name = 'Database.close'
        
        return new Promise( (resolve, reject) =>
            this.connection.end( err => {
                if (err) {
                    logs.error(name, 'DB closing', err.message)
                    reject()
                } else {
                    logs.trace(name, 'DB closure successful')
                    resolve()
                }
            })
        )
    }
}

export const database = new Database()
