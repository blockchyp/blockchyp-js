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

  tokenize (publicKey, card) {
    console.log('tokenize called')
    let token = CryptoUtils.generateNonce()
    return {
      token: token,
      last4: '0001',
      maskedPan: '**************0001',
      expMonth: 1,
      expYear: 2020,
      paymentMethod: 'VISA'
    }
  }

  heartbeat (creds) {
    return this._gatewayGet('/api/heartbeat', creds)
  }

  verify (creds, request) {
    return this._gatewayPost('/api/verify', creds, request)
  }

  enroll (creds, request) {
    return this._gatewayPost('/api/enroll', creds, request)
  }

  test (terminal, creds) {
    return this._terminalPost(terminal, '/api/test', creds)
  }

  charge (terminal, creds, amount, options) {
    creds['amount'] = amount
    this.populateOptions(creds, options)
    return this._terminalPost(terminal, '/api/charge', creds)
  }

  giftActivate (terminal, creds, amount, options) {
    creds['amount'] = amount
    this.populateOptions(creds, options)
    return this._terminalPost(terminal, '/api/gift-activate', creds)
  }

  refund (terminal, creds, amount, options) {
    creds['amount'] = amount
    this.populateOptions(creds, options)
    return this._terminalPost(terminal, '/api/refund', creds)
  }

  preauth (terminal, creds, amount, options) {
    creds['amount'] = amount
    this.populateOptions(creds, options)
    return this._terminalPost(terminal, '/api/preauth', creds)
  }

  populateOptions (tx, options) {
    if (options) {
      if (options.tipAmount) {
        tx['tipAmount'] = options['tipAmount']
      }
      if (options.taxAmount) {
        tx['taxAmount'] = options['taxAmount']
      }
    }
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

  _getTerminalConfig () {
    let config = {}

    config['timeout'] = 30000
    config['headers'] = {
      'Content-Type': 'application/octet-stream'
    }

    return config
  }

  _gatewayPost (path, creds, payload) {
    let url = this.host + path
    console.log('POST: ' + url)
    return axios.post(url, payload, this._getGatewayConfig(creds))
  }

  async _terminalGet (terminal, path, creds) {
    let addr = await this._resolveTerminalAddress(terminal, creds)
    let url = addr + path
    console.log('GET: ' + url)
    let config = this._getTerminalConfig()
    return axios.get(url, config)
  }

  async _terminalPost (terminal, path, payload) {
    let addr = await this._resolveTerminalAddress(terminal, payload)
    let url = addr + path
    console.log('POST: ' + url)
    let config = this._getTerminalConfig()
    return axios.post(url, JSON.stringify(payload), config)
  }

  async _resolveTerminalAddress (terminal, creds) {
    if (this._isIpAdress(terminal)) {
      return 'http://' + terminal + ':8080'
    } else {
      let apiRoutes = this._routeCache[creds.apiKey]
      var cachedRoute
      if (apiRoutes) {
        cachedRoute = apiRoutes[terminal]
      }
      if (cachedRoute) {
        return 'http://' + cachedRoute.ipAddress + ':8080'
      } else {
        let route = await this._resolveRouteTo(terminal, creds)
        let apiRoutes = this._routeCache[creds.apiKey]
        if (!apiRoutes) {
          apiRoutes = {}
          this._routeCache[creds.apiKey] = apiRoutes
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
  constructor (apiKey, bearerToken, signingKey) {
    this.apiKey = apiKey
    this.bearerToken = bearerToken
    this.signingKey = signingKey
  }
}

var BlockChyp = new BlockChypClient()
export default BlockChyp
