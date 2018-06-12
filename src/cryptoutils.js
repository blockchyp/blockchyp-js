var createHmac = require('create-hmac')
var randomBytes = require('randombytes')
var moment = require('moment')
var base32 = require('base32')
var BN = require('bn.js')

const GROUP_14_PRIME = 'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF'
const GROUP_14_GENERATOR = 2

export class BlockChypCrypto {
  generateGatewayHeaders (creds) {
    let nonce = this.generateNonce()
    let ts = this.generateIsoTimestamp()
    let toSign = creds.apiId + creds.bearerToken + ts + nonce
    let key = Buffer.from(creds.signingKey, 'hex')
    let hmac = createHmac('sha256', key)
    hmac.update(toSign)
    let sig = hmac.digest('hex')

    var results = {
      nonce: nonce,
      timestamp: ts,
      authHeader: 'Dual ' + creds.bearerToken + ':' + creds.apiId + ':' + sig
    }

    return results
  }

  generateDiffieHellmanKeys () {
    let p = new BN(GROUP_14_PRIME, 16)
    let g = new BN(GROUP_14_GENERATOR, 10)

    let aHex = randomBytes(p.byteLength()).toString('hex')

    let a = new BN(aHex, 16)
    let pMont = BN.mont(p)
    let pub = g.toRed(pMont).redPow(a).fromRed()

    return {
      privateKey: a.toString(16),
      publicKey: pub.toString(16)
    }
  }

  computeSharedKey (privateKey, otherPublicKey) {
    let p = new BN(GROUP_14_PRIME, 16)
    let pub = new BN(otherPublicKey, 16)
    let priv = new BN(privateKey, 16)

    let pMont = BN.mont(p)
    let shared = pub.toRed(pMont).redPow(priv).fromRed()
    return shared.toString(16)
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
