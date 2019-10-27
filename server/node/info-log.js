import { createWriteStream } from 'fs'

const logDirectory = '/home/pi'
const logFile = createWriteStream(path.join(logDirectory, 'node.log'), { flags: 'a' })

const currentTime = () => {
    const date = new Date()
    return `${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}:${date.getMilliseconds()}`
}

/**
 * Data class which encapsulates info needed for a single log
 */
class LogInfo {

    constructor (fileName, sectionName, severity, message, detailedMessage) {
        this.fileName = fileName
        this.sectionName = sectionName
        this.severity = severity
        this.message = message
        this.detailedMessage = detailedMessage
    }

    /** 
     * Perform logging to the console, as well as detailed logging to the log file
     */
    log = () => {
        const detailedSeverity =
            this.severity == trace ? '...' :
            this.severity == info ? '...' :
            this.severity == debug ? 'debug' :
            this.severity == warning ? 'warning' :
            this.severity == error ? 'ERROR' :
            ''

        const severity =
            this.severity == trace ? '' :
            this.severity == info ? '' :
            this.severity == debug ? '' :
            this.severity == warning ? 'Warning' :
            this.severity == error ? 'ERROR' :
            ''

        console.log(`${this.fileName} | ${this.sectionName} | ${severity}  >  ${this.message}`)

        logFile.write(
            `----- ${currentTime()} | ${this.fileName} | ${this.sectionName} | ` +
            `${detailedSeverity} | ${this.message} > ${this.detailedMessage}\n`
        )
    }
}

/**
 *  Class responsible for logging for a single code file
 */
export class LogManager {
    
    constructor (fileName) {
        this.fileName = fileName
    }

    initTrace = (sectionName, message, detailedMessage) =>
        new LogInfo(this.fileName, sectionName, trace, message, detailedMessage)
    initInfo = (sectionName, message, detailedMessage) =>
        new LogInfo(this.fileName, sectionName, info, message, detailedMessage)
    initDebug = (sectionName, message, detailedMessage) =>
        new LogInfo(this.fileName, sectionName, debug, message, detailedMessage)
    initWarn = (sectionName, message, detailedMessage) =>
        new LogInfo(this.fileName, sectionName, warn, message, detailedMessage)
    initError = (sectionName, message, detailedMessage) =>
        new LogInfo(this.fileName, sectionName, error, message, detailedMessage)

    trace = async (sectionName, message, detailedMessage) =>
        this.initTrace(sectionName, message, detailedMessage).log()
    info = async (sectionName, message, detailedMessage) =>
        this.initInfo(sectionName, message, detailedMessage).log()
    debug = async (sectionName, message, detailedMessage) =>
        this.initDebug(sectionName, message, detailedMessage).log()
    warn = async (sectionName, message, detailedMessage) =>
        this.initWarn(sectionName, message, detailedMessage).log()
    error = async (sectionName, message, detailedMessage) =>
        this.initError(sectionName, message, detailedMessage).log()
}

const trace = 0
const info = 1
const debug = 2
const warn = 3
const error = 4
