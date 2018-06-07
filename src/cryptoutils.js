var crypto = require('crypto')
var moment = require('moment')
var base32 = require('base32')

export class BlockChypCrypto {
  generateGatewayHeaders (creds) {
    let nonce = this.generateNonce()
    let ts = this.generateIsoTimestamp()
    let toSign = creds.apiId + creds.bearerToken + ts + nonce
    let key = Buffer.from(creds.signingKey, 'hex')
    let hmac = crypto.createHmac('sha256', key)
    hmac.update(toSign)
    let sig = hmac.digest('hex')

    var results = {
      nonce: nonce,
      timestamp: ts,
      authHeader: 'Dual ' + creds.bearerToken + ':' + creds.apiId + ':' + sig
    }

    return results
  }

  generateNonce () {
    return base32.encode(crypto.randomBytes(32)).toUpperCase()
  }

  generateIsoTimestamp () {
    return moment().utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  }
}

var CryptoUtils = new BlockChypCrypto()
export default CryptoUtils
