var createHmac = require('create-hmac')
var randomBytes = require('randombytes')
var moment = require('moment')
var base32 = require('base32')
var EC = require('elliptic').ec
var aesjs = require('aes-js')
var shajs = require('sha.js')

export class BlockChypCrypto {
  generateGatewayHeaders (creds) {
    let nonce = this.generateNonce()
    let ts = this.generateIsoTimestamp()
    let toSign = creds.apiKey + creds.bearerToken + ts + nonce
    let key = Buffer.from(creds.signingKey, 'hex')
    let hmac = createHmac('sha256', key)
    hmac.update(toSign)
    let sig = hmac.digest('hex')

    var results = {
      nonce: nonce,
      timestamp: ts,
      authHeader: 'Dual ' + creds.bearerToken + ':' + creds.apiKey + ':' + sig
    }

    return results
  }

  encrypt (hexKey, plainText) {
    let key = Buffer.from(hexKey, 'hex').slice(0, 32)
    let keyArr = [...key]

    let iv = randomBytes(16)
    let ivArr = [...iv]

    let aesCbc = new aesjs.ModeOfOperation.cbc(keyArr, ivArr)
    let plainBytes = aesjs.padding.pkcs7.pad(aesjs.utils.utf8.toBytes(plainText))
    let encryptedBytes = aesCbc.encrypt(plainBytes)

    return iv.toString('hex') + aesjs.utils.hex.fromBytes(encryptedBytes)
  }

  sha256Hash (msg) {
    return shajs('sha256').update(msg, 'hex').digest('hex')
  }

  validateSignature (publicKey, msg, sig) {
    var ec = new EC('p256')
    let key = ec.keyFromPublic({x: publicKey.x, y: publicKey.y})
    let msgHash = this.sha256Hash(msg)
    return key.verify(msgHash, {r: sig.r, s: sig.s})
  }

  decrypt (hexKey, cipherText) {
    let key = Buffer.from(hexKey, 'hex').slice(0, 32)
    let keyArr = [...key]

    let cipherBytes = Buffer.from(cipherText, 'hex')
    let iv = cipherBytes.slice(0, 16)

    var aesCbc = new aesjs.ModeOfOperation.cbc(keyArr, iv)

    let cipher = cipherBytes.slice(16, cipherBytes.length)
    let cipherArr = [...cipher]
    let decryptedBytes = aesjs.padding.pkcs7.strip(aesCbc.decrypt(cipherArr))

    return aesjs.utils.utf8.fromBytes(decryptedBytes)
  }

  generateNonce () {
    return base32.encode(randomBytes(32)).toUpperCase()
  }

  generateIsoTimestamp () {
    return moment().utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z'
  }
}

var CryptoUtils = new BlockChypCrypto()
export default CryptoUtils
