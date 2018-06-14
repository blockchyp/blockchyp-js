import axios from 'axios'
import CryptoUtils from './cryptoutils'

class BlockChypClient {
  constructor () {
    this.host = 'https://api.blockchyp.com'
    this.defaultCreds = {}
    this._routeCache = {}
    this._terminalKeys = {}
  }

  getHost () {
    return this.host
  }

  setHost (host) {
    this.host = host
  }

  heartbeat (creds) {
    return this._gatewayGet('/api/heartbeat', creds)
  }

  test (terminal, creds) {
    return this._terminalPost(terminal, '/api/test', creds)
  }

  _gatewayGet (path, creds) {
    let url = this.host + path
    console.log('GET: ' + url)
    return axios.get(url, this._getGatewayConfig(creds))
  }

  _getGatewayConfig (creds) {
    let config = {}
    if (creds) {
      let headers = CryptoUtils.generateGatewayHeaders(creds)
      config['headers'] = {
        'Nonce': headers.nonce,
        'Timestamp': headers.timestamp,
        'Authorization': headers.authHeader
      }
    }
    return config
  }

  async _getTerminalKey (terminal, creds) {
    let termKey = this._terminalKeys[terminal]
    if (!termKey) {
      termKey = await this._resolveTerminalKey(terminal, creds)
    }
    return termKey
  }

  _getTerminalConfig (key) {
    let config = {}

    config['headers'] = {
      'Content-Type': 'application/octet-stream',
      'x-blockchyp-terminal-key': key.publicKey
    }
    config['transformResponse'] = [
      function (data) {
        return JSON.parse(CryptoUtils.decrypt(key.derivedKey, data))
      }
    ]

    console.log(config)

    return config
  }

  async _resolveTerminalKey (terminal, creds) {
    let apiRoutes = this._routeCache[creds.apiId]
    var cachedRoute
    if (apiRoutes) {
      cachedRoute = apiRoutes[terminal]
    }
    let key = CryptoUtils.generateDiffieHellmanKeys()
    this._terminalKeys[terminal] = key
    let req = {
      publicKey: key.publicKey
    }
    let url = 'http://' + cachedRoute.ipAddress + ':8080/api/kex'
    let kexResponse = await axios.post(url, req)

    let validSig = CryptoUtils.validateSignature(cachedRoute.rawKey, kexResponse.data.publicKey, kexResponse.data.rawSig)

    if (validSig) {
      key['derivedKey'] = CryptoUtils.computeSharedKey(key.privateKey, kexResponse.data.publicKey)
      this._terminalKeys[terminal] = key
      return key
    } else {
      console.log('bad signature')
    }
  }

  _gatewayPost (path, creds, payload) {
    let url = this.host + path
    console.log('POST: ' + url)
    return axios.post(url, payload, this._getGatewayConfig(creds))
  }

  async _terminalGet (terminal, path, creds) {
    let addr = await this._resolveTerminalAddress(terminal, creds)
    let key = await this._getTerminalKey(terminal, creds)
    let url = addr + path
    console.log('GET: ' + url)
    let config = this._getTerminalConfig(key)
    return axios.get(url, config)
  }

  async _terminalPost (terminal, path, payload) {
    let addr = await this._resolveTerminalAddress(terminal, payload)
    let key = await this._getTerminalKey(terminal, payload)
    let url = addr + path
    console.log('POST: ' + url)
    let config = this._getTerminalConfig(key)
    let cipherText = CryptoUtils.encrypt(key.derivedKey, JSON.stringify(payload))
    return axios.post(url, cipherText, config)
  }

  async _resolveTerminalAddress (terminal, creds) {
    if (this._isIpAdress(terminal)) {
      return 'http://' + terminal + ':8080'
    } else {
      let apiRoutes = this._routeCache[creds.apiId]
      var cachedRoute
      if (apiRoutes) {
        cachedRoute = apiRoutes[terminal]
      }
      if (cachedRoute) {
        return 'http://' + cachedRoute.ipAddress + ':8080'
      } else {
        let route = await this._resolveRouteTo(terminal, creds)
        let apiRoutes = this._routeCache[creds.apiId]
        if (!apiRoutes) {
          apiRoutes = {}
          this._routeCache[creds.apiId] = apiRoutes
        }
        apiRoutes[terminal] = route
        return 'http://' + route.ipAddress + ':8080'
      }
    }
  }

  async _resolveRouteTo (terminal, creds) {
    console.log('Resolving Route: ' + terminal)
    let routeResponse = await this._gatewayGet('/api/terminal-route?terminal=' + terminal, creds)
    return routeResponse.data
  }

  _isIpAdress (ipAddress) {
    var tokens = ipAddress.split('.')
    if (tokens.length !== 4) {
      return false
    }
    return true
  }
}

export class BlockChypCredentials {
  constructor (apiId, bearerToken, signingKey) {
    this.apiId = apiId
    this.bearerToken = bearerToken
    this.signingKey = signingKey
  }
}

var BlockChyp = new BlockChypClient()
export default BlockChyp
