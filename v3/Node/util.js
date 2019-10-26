import { post } from 'request'
import { exec } from 'child_process'
import { LogManager } from './info-log'

const logs = new LogManager(__filename)

/**
 * MAC address of this machine.
 */
export var mac = null

/**
 * Extract the object with the given key from the body of the holder.
 * @param {any} holder - an object with a 'body' property.
 * @param {string} key - the key of the value in the body.
 * @param {boolean} log - log the value.
 */
export const get = async (holder, key, log) => {

    const name = this.get.name

    if (key in holder.body) {
        if (log != null) logs.info(name, `${key}: ${holder.body[key]}`)
        return holder.body[key]
    } else {
        logs.error(name, `Key ${key} not found in holder`)
        throw 'key'
    }
}

/**
 * Go through a list.
 * @param {} handle - perform this function on every element.
 * @returns {Promise} a Promise which resolves after going through the whole list.
 */
export const forEachResolve = async (list, handle) => {
    
    let count = 0
    return new Promise( (resolve, reject) =>
        list.forEach( instance => {
            handle(instance)
            if (++count == list.length) resolve()
        })
    )
}

/**
 * Searches for a target object in the given list.
 * @param {} handle - Defines how to derive the comparing object from a member of the list.
 * @returns {Promise} a Promise which resolves after finding the target, or rejects if the target is not
 * in the list.
 */
export const findTarget = async (list, target, handle) => {
    
    const name = this.findTarget.name
    logs.trace(name, `Target: ${target}`)

    let count = 0
    return new Promise( (resolve, reject) => 
        list.forEach( instance => {
            if (handle(instance) == target) {
                logs.info(name, 'Target found')
                resolve(instance)
            }
            else ++count

            if (count == list.length) {
                logs.error(name, `Target not found`)
                reject()
            }
        })
    )
}

/**
 * Execute a Bash script.
 * @returns {Promise} a Promise which defines the outcome of the execution.
 */
export const performScript = async text => {

    const name = this.requestPost.name

    return new Promise( (resolve, reject) =>
        exec(text, (err, stdout, stderr) => {
            if (err) {
                logs.error(name, 'System request failed', err.message)
                reject(err)
            } else {
                logs.trace(name, `System request successful: ${body}`)
                resolve(stdout)
            }
        })
    )
}

/**
 * Init MAC address
 */
(async () => {

    if (mac != null) return mac

	mac = (await performScript(
        "ifconfig wlan0 | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}'"
    )).substring(0, 17)
    
    logs.info('Util', `Local MAC: ${mac}`)
    return mac
})()

/**
 * Send a POST request.
 * @param {string} url - Target
 * @param {JSON} json - Parameters
 * @returns {Promise} a Promise which resolves with the body of the response, or rejects if the
 * request failed.
 */
export const requestPost = async (url, json) => {

    const name = this.requestPost.name

    return new Promise( (resolve, reject) =>
        post(url, json, (err, response, body) => {
            if (err) {
                logs.error(name, 'Request failed', err.message)
                reject(err)
            } else {
                logs.trace(name, `Response received: ${body}`)
                resolve(body)
            }
        })
    )
}
