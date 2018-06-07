import axios from 'axios'
import CryptoUtils from './cryptoutils'

class BlockChypClient {
  constructor () {
    this.host = 'https://api.blockchyp.com'
    this.defaultCreds = {}
    this._routeCache = {}
    this._terminalKeys = {}
    this.sessionKeys = {}
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

  _getTerminalConfig (creds) {
    let config = {}
    if (!this.sessionKeys) {
      this.sessionKeys = CryptoUtils.generateRsaKeys()
    }
    config['headers'] = {
      'ResponseKey': this.sessionKeys.publicKey
    }
    return config
  }

  _gatewayPost (path, creds, payload) {
    let url = this.host + path
    console.log('POST: ' + url)
    return axios.post(url, payload, this._getGatewayConfig(creds))
  }

  _terminalGet (terminal, path, creds) {
    let url = this._resolveTerminalAddress(terminal) + path
    console.log('GET: ' + url)
    return axios.get(url, this._getTerminalConfig(creds))
  }

  _terminalPost (terminal, path, payload) {
    let url = this._resolveTerminalAddress(payload.apiId, terminal) + path
    console.log('POST: ' + url)
    return axios.post(url, payload, this._getTerminalConfig(payload))
  }

  _resolveTerminalAddress (apiId, terminal) {
    if (this._isIpAdress(terminal)) {
      return 'http://' + terminal + ':8080'
    } else {
      return 'http://' + this._resolveRouteTo(apiId, terminal) + ':8080'
    }
  }

  _resolveRouteTo (apiId, terminal) {
    // syncronous call
    // const response = await axios.get(this.host + '/api/terminal-route?terminal=');
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
