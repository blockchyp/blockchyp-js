var crypto = require('crypto')
var base32 = require('base32')
var moment = require('moment')

export class BlockChypCrypto {
  generateGatewayHeaders (creds) {
    let nonce = this.generateNonce()
    let ts = this.generateIsoTimestamp()

    let toSign = creds.apiId + creds.bearerToken + ts + nonce

    let hmac = crypto.createHmac('sha256', base32.decode(creds.signingKey))
    hmac.update(toSign)
    let sig = base32.encode(hmac.digest()).toUpperCase()

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

var Crypto = new BlockChypCrypto()
export default Crypto
