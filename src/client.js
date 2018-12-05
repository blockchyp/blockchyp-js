import axios from 'axios'
import CryptoUtils from './cryptoutils'

class BlockChypClient {
  constructor (creds) {
    this.gatewayHost = 'https://api.blockchyp.com'
    this.credentials = creds
    this.https = true
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

  heartbeat () {
    return this._gatewayGet('/heartbeat')
  }

  async enroll (authRequest) {
    if (this.isTerminalRouted(authRequest)) {
      let route = await this._resolveTerminalRoute(authRequest.terminalName)
      if (route) {
        return this._terminalPost(route, '/enroll', authRequest)
      }
    } else {
      return this._gatewayPost('/enroll', authRequest)
    }
  }

  async ping (terminal) {
    let route = await this._resolveTerminalRoute(terminal)
    return this._terminalPost(route, '/test')
  }

  async charge (authRequest) {
    if (this.isTerminalRouted(authRequest)) {
      let route = await this._resolveTerminalRoute(authRequest.terminalName)
      console.log(JSON.stringify(route))
      if (route) {
        return this._terminalPost(route, '/charge', authRequest)
      }
    } else {
      return this._gatewayPost('/charge', authRequest)
    }
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
    if (this.isTerminalRouted(authRequest)) {
      let route = await this._resolveTerminalRoute(authRequest.terminalName)
      if (route) {
        return this._terminalPost(route, '/refund', authRequest)
      }
    } else {
      return this._gatewayPost('/refund', authRequest)
    }
  }

  async preauth (authRequest) {
    if (this.isTerminalRouted(authRequest)) {
      let route = await this._resolveTerminalRoute(authRequest.terminalName)
      console.log(JSON.stringify(route))
      if (route) {
        return this._terminalPost(route, '/preauth', authRequest)
      }
    } else {
      return this._gatewayPost('/preauth', authRequest)
    }
  }

  isTerminalRouted (request) {
    if (request.terminalName) {
      return true
    } else {
      return false
    }
  }

  _gatewayGet (path, creds) {
    let url = this.gatewayHost + '/api' + path
    return axios.get(url, this._getGatewayConfig())
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

    config['timeout'] = 30000
    config['headers'] = {
      'Content-Type': 'application/octet-stream'
    }

    return config
  }

  _gatewayPost (path, payload) {
    let url = this.gatewayHost + '/api' + path
    console.log(url)
    return axios.post(url, payload, this._getGatewayConfig())
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
    console.log('Resolving Route: ' + terminalName)
    let cacheEntry = this._routeCache[terminalName]

    if (cacheEntry) {
      // check cache expiration
      if (cacheEntry.ttl > new Date()) {
        return cacheEntry.route
      }
    }

    let routeResponse = await this._gatewayGet('/terminal-route?terminal=' + terminalName, this.credentials)
    let route = routeResponse.data
    this._routeCache[terminalName] =
      {
        ttl: new Date(new Date() + this.routeCacheTTL * 60000),
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
