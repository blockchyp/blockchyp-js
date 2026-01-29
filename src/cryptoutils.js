var { hmac } = require('@noble/hashes/hmac')
var { sha256 } = require('@noble/hashes/sha256')
var { randomBytes, bytesToHex, utf8ToBytes } = require('@noble/hashes/utils')
var { p256 } = require('@noble/curves/nist')
var moment = require('moment')
var base32 = require('base32')
var aesjs = require('aes-js')

export class BlockChypCrypto {
  generateGatewayHeaders (creds) {
    let nonce = this.generateNonce()
    let ts = this.generateIsoTimestamp()
    let toSign = creds.apiKey + creds.bearerToken + ts + nonce
    let key = Buffer.from(creds.signingKey, 'hex')
    let mac = hmac(sha256, key, utf8ToBytes(toSign))
    let sig = bytesToHex(mac)

    var results = {
      'Nonce': nonce,
      'Timestamp': ts,
      'Authorization': 'Dual ' + creds.bearerToken + ':' + creds.apiKey + ':' + sig
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

    return bytesToHex(iv) + aesjs.utils.hex.fromBytes(encryptedBytes)
  }

  sha256Hash (msg) {
    let msgBytes = Buffer.from(msg, 'hex')
    return bytesToHex(sha256(msgBytes))
  }

  validateSignature (publicKey, msg, sig) {
    // Hash the message
    let msgHash = this.sha256Hash(msg)
    let msgHashBytes = Buffer.from(msgHash, 'hex')

    // Convert hex string coordinates to BigInt and create point
    let pubKeyPoint = p256.ProjectivePoint.fromAffine({
      x: BigInt('0x' + publicKey.x),
      y: BigInt('0x' + publicKey.y)
    })
    let pubKeyBytes = pubKeyPoint.toRawBytes(false)

    // Create signature from r, s components
    let signature = new p256.Signature(
      BigInt('0x' + sig.r),
      BigInt('0x' + sig.s)
    )
    let sigBytes = signature.toCompactRawBytes()

    // Verify signature
    return p256.verify(sigBytes, msgHashBytes, pubKeyBytes, { prehash: true })
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
