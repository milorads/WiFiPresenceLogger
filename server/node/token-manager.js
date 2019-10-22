import rsa from 'node-rsa'

const tokenHeader = new Buffer(JSON.stringify( { alg: 'rs256' })).toString('base64')

export class TokenManager {

    constructor () {
        this.tokenRsa = new rsa( { b: 512 })
    }

    generate = async username => {
        const name = 'TokenManager.generate'

        try {
            const exp = new Date().getTime() + 180 * 1000
            
            const payload = new Buffer(JSON.stringify( { usr: username, exp: exp }))
                .toString('base64')
            
            const plaintext = tokenHeader + payload
            const signature = tokenRsa.sign(plaintext, 'base64', 'base64')
            const token = `${payload}.${signature}`
            
            logs.info(name, `New token generated / Token value is: ${token}`)
            return token

        } catch (err) {
            logs.error(name, 'Failed to generate token', err)
            throw 'generation'
        }
    }

    authenticate = async token => {
        
        const name = 'TokenManager.authenticate'
        logs.trace(name, 'Authenticating token...')
        logs.info(name, `Token: ${token}`)

        try {
            const comps = token.split('.')
            const payload = comps[0]
            const signature = comps[1]
            const plaintext = tokenHeader + payload
            
            if (!tokenRsa.verify(plaintext, signature, 'base64', 'base64')) {
                logs.error(name, 'Authentication failed', 'Token invalid')
                throw 'signature'
            }

            const info = JSON.parse(new Buffer(payload, 'base64').toString('ascii'))
            if (info.exp < new Date().getTime()) {
                logs.error(name, 'Authentication failed', 'Token expired')
                throw 'expired'
            }
            
            logs.trace(name, 'Token authenticated')
            return info

        } catch (err) {
            logs.error(name, 'Authentication failed', 'Wrong token format')
            throw 'format'
        }
    }

    authenticateRequest = async (req, res) => {
        const info = await this.authenticate(('token' in req.body) ? req.body.token : null)
        return res.setHeader('token', this.generate(info.usr))
    }

    authenticateRequestDummy = async (req, res) => null
}