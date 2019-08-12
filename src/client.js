import axios from 'axios'
import CryptoUtils from './cryptoutils'
import nodeHttps from 'https'
import browserifyHttps from 'https-browserify'

class BlockChypClient {
  constructor (creds) {
    this.gatewayHost = 'https://api.blockchyp.com'
    this.testGatewayHost = 'https://test.blockchyp.com'
    this.credentials = creds
    this.https = true
    this.cloudRelay = false
    this.routeCacheTTL = 60
    this.defaultTimeout = 60
    this._routeCache = {}
  }

  newClient (creds) {
    return new BlockChypClient(creds)
  }

  getGatewayHost () {
    return this.gatewayHost
  }

  setGatewayHost (host) {
    this.gatewayHost = host
  }

  setTestGatewayHost (host) {
    this.testGatewayHost = host
  }

  tokenize (publicKey, card) {
    let token = CryptoUtils.generateNonce()
    // stubbed in
    return {
      token: token,
      last4: '0001',
      maskedPan: '**************0001',
      expMonth: 1,
      expYear: 2020,
      paymentMethod: 'VISA'
    }
  }

  heartbeat () {
    return this._gatewayGet('/heartbeat')
  }

  async enroll (authRequest) {
    return this.routeTerminalPost(authRequest, '/enroll')
  }

  async ping (terminal) {
    let route = await this._resolveTerminalRoute(terminal)
    return this._terminalPost(route, '/test')
  }

  async message (request) {
    return this.routeTerminalPost(request, '/message')
  }

  async tc (request) {
    return this.routeTerminalPost(request, '/tc')
  }

  async newTransactionDisplay (request) {
    return this.routeTerminalPost(request, '/txdisplay', '/terminal-txdisplay')
  }

  async updateTransactionDisplay (request) {
    return this.routeTerminalPut(request, '/txdisplay', '/terminal-txdisplay')
  }

  async clear (request) {
    return this.routeTerminalPost(request, '/clear', '/terminal-clear')
  }

  async booleanPrompt (request) {
    return this.routeTerminalPost(request, '/boolean-prompt')
  }

  async textPrompt (request) {
    return this.routeTerminalPost(request, '/text-prompt')
  }

  async routeTerminalPost (request, terminalPath, cloudPath) {
    if (this.isTerminalRouted(request)) {
      let route = await this._resolveTerminalRoute(request.terminalName)
      if (route && !route.cloudRelayEnabled) {
        return this._terminalPost(route, terminalPath, request)
      }
    } else if (cloudPath) {
      return this._gatewayPost(cloudPath, request)
    }
    return this._gatewayPost(terminalPath, request)
  }

  async routeTerminalPut (request, terminalPath, cloudPath) {
    if (this.isTerminalRouted(request)) {
      let route = await this._resolveTerminalRoute(request.terminalName)
      if (route && !route.cloudRelayEnabled) {
        return this._terminalPut(route, terminalPath, request)
      }
    } else if (cloudPath) {
      return this._gatewayPut(cloudPath, request)
    }
    return this._gatewayPut(terminalPath, request)
  }

  async charge (authRequest) {
    if (!this.validateRequest(authRequest)) {
      return this.returnValidationError('invalid request')
    }

    return this.routeTerminalPost(authRequest, '/charge')
  }

  returnValidationError (desc) {
    let result = {
      data: {
        approved: false,
        success: false,
        error: desc
      }
    }
    return result
  }

  validateRequest (request) {
    if (!this.validateCurrency(request.amount)) {
      return false
    }
    return true
  }

  validateCurrency (val) {
    let amt = parseFloat(val)
    console.log(amt)
    if (amt && !isNaN(amt)) {
      if (val.match(/\./g || []).length > 1) {
        return false
      }
      return true
    }
    return false
  }

  capture (request) {
    return this._gatewayPost('/capture', request)
  }

  void (request) {
    return this._gatewayPost('/void', request)
  }

  closeBatch (request) {
    return this._gatewayPost('/close-batch', request)
  }

  async giftActivate (request) {
    let route = await this._resolveTerminalRoute(request.terminalName)
    return this._terminalPost(route, '/gift-activate', request)
  }

  async refund (authRequest) {
    if (!this.validateRequest(authRequest)) {
      return this.returnValidationError('invalid request')
    }
    return this.routeTerminalPost(authRequest, '/refund')
  }

  async preauth (authRequest) {
    if (!this.validateRequest(authRequest)) {
      return this.returnValidationError('invalid request')
    }
    return this.routeTerminalPost(authRequest, '/preauth')
  }

  isTerminalRouted (request) {
    if (this.cloudRelay) {
      return false
    } else if (request.terminalName) {
      return true
    }
    return false
  }

  _gatewayGet (path, creds, testTx) {
    return axios.get(this._assembleGatewayUrl(path), this._getGatewayConfig())
  }

  _getGatewayConfig () {
    let config = {}
    if (this.credentials && this.credentials.apiKey) {
      let headers = CryptoUtils.generateGatewayHeaders(this.credentials)
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

    config['timeout'] = 90000
    config['headers'] = {
      'Content-Type': 'application/octet-stream'
    }
    if (this.https) {
      if (nodeHttps) {
        config['httpsAgent'] = new nodeHttps.Agent({
          rejectUnauthorized: false
        })
      } else {
        config['httpsAgent'] = new browserifyHttps.Agent({
          rejectUnauthorized: false
        })
        config['httpsAgent'].protocol = 'https:'
      }
    }

    return config
  }

  _gatewayPost (path, payload) {
    return axios.post(this._assembleGatewayUrl(path, payload), payload, this._getGatewayConfig())
  }

  _gatewayPut (path, payload) {
    return axios.put(this._assembleGatewayUrl(path, payload), payload, this._getGatewayConfig())
  }

  _assembleGatewayUrl (path, payload) {
    let result = ''
    if (payload && payload.test) {
      result = result + this.testGatewayHost
    } else {
      result = result + this.gatewayHost
    }
    result = result + '/api' + path
    return result
  }

  async _terminalGet (terminal, path, creds) {
    let addr = await this._resolveTerminalAddress(terminal, creds)
    let url = addr + path
    console.log('GET: ' + url)
    let config = this._getTerminalConfig()
    return axios.get(url, config)
  }

  async _terminalPost (route, path, payload) {
    let url = await this._assembleTerminalUrl(route, path)
    console.log('POST: ' + url)
    let config = this._getTerminalConfig()
    let wrapper = {
      apiKey: route.transientCredentials.apiKey,
      bearerToken: route.transientCredentials.bearerToken,
      signingKey: route.transientCredentials.signingKey,
      request: payload
    }
    return axios.post(url, JSON.stringify(wrapper), config)
  }

  async _terminalPut (route, path, payload) {
    let url = await this._assembleTerminalUrl(route, path)
    console.log('PUT: ' + url)
    let config = this._getTerminalConfig()
    let wrapper = {
      apiKey: route.transientCredentials.apiKey,
      bearerToken: route.transientCredentials.bearerToken,
      signingKey: route.transientCredentials.signingKey,
      request: payload
    }
    return axios.put(url, JSON.stringify(wrapper), config)
  }

  _assembleTerminalUrl (route, path) {
    let result = 'http'
    if (this.https) {
      result = result + 's'
    }
    result = result + '://'
    result = result + route.ipAddress
    if (this.https) {
      result = result + ':8443'
    } else {
      result = result + ':8080'
    }
    result = result + '/api'
    result = result + path
    return result
  }

  async _resolveTerminalRoute (terminalName) {
    let cacheEntry = this._routeCache[terminalName]

    if (cacheEntry) {
      if (cacheEntry.ttl >= new Date().getTime()) {
        return cacheEntry.route
      }
    }

    let routeResponse = await this._gatewayGet('/terminal-route?terminal=' + terminalName, this.credentials)
    let route = routeResponse.data
    this._routeCache[terminalName] =
      {
        ttl: new Date().getTime() + (this.routeCacheTTL * 60000),
        route: route
      }

    return route
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
