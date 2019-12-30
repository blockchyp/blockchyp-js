/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */
import axios from 'axios'
import CryptoUtils from './cryptoutils'
import nodeHttps from 'https'
import browserifyHttps from 'https-browserify'

const CardType = Object.freeze({
  CREDIT: 0,
  DEBIT: 1,
  EBT: 2,
  BLOCKCHAIN_GIFT: 3,
})

const SignatureFormat = Object.freeze({
  NONE: "",
  PNG: "png",
  JPG: "jpg",
  GIF: "gif",
})

const PromptType = Object.freeze({
  AMOUNT: "amount",
  EMAIL: "email",
  PHONE_NUMBER: "phone",
  CUSTOMER_NUMBER: "customer-number",
  REWARDS_NUMBER: "rewards-number",
})

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

  heartbeat () {
    return this._gatewayGet('/heartbeat')
  }

  /**
   * Executes a standard direct preauth and capture.
   */
  async charge (request) {
    return this.routeTerminalPost(request, '/charge', '/charge')
  }
  /**
   * Executes a preauthorization intended to be captured later.
   */
  async preauth (request) {
    return this.routeTerminalPost(request, '/preauth', '/preauth')
  }
  /**
   * Tests connectivity with a payment terminal.
   */
  async ping (request) {
    return this.routeTerminalPost(request, '/test', '/terminal-test')
  }
  /**
   * Checks the remaining balance on a payment method.
   */
  async balance (request) {
    return this.routeTerminalPost(request, '/balance', '/balance')
  }
  /**
   * Clears the line item display and any in progress transaction.
   */
  async clear (request) {
    return this.routeTerminalPost(request, '/clear', '/terminal-clear')
  }
  /**
   * Prompts the user to accept terms and conditions.
   */
  async termsAndConditions (request) {
    return this.routeTerminalPost(request, '/tc', '/terminal-tc')
  }
  /**
   * Appends items to an existing transaction display Subtotal, Tax, and Total are
   * overwritten by the request. Items with the same description are combined into
   * groups.
   */
  async updateTransactionDisplay (request) {
    return this.routeTerminalPost(request, '/txdisplay', '/terminal-txdisplay')
  }
  /**
   * Displays a new transaction on the terminal.
   */
  async newTransactionDisplay (request) {
    return this.routeTerminalPost(request, '/txdisplay', '/terminal-txdisplay')
  }
  /**
   * Asks the consumer text based question.
   */
  async textPrompt (request) {
    return this.routeTerminalPost(request, '/text-prompt', '/text-prompt')
  }
  /**
   * Asks the consumer a yes/no question.
   */
  async booleanPrompt (request) {
    return this.routeTerminalPost(request, '/boolean-prompt', '/boolean-prompt')
  }
  /**
   * Displays a short message on the terminal.
   */
  async message (request) {
    return this.routeTerminalPost(request, '/message', '/message')
  }
  /**
   * Executes a refund.
   */
  async refund (request) {
    return this.routeTerminalPost(request, '/refund', '/refund')
  }
  /**
   * Adds a new payment method to the token vault.
   */
  async enroll (request) {
    return this.routeTerminalPost(request, '/enroll', '/enroll')
  }
  /**
   * Activates or recharges a gift card.
   */
  async giftActivate (request) {
    return this.routeTerminalPost(request, '/gift-activate', '/gift-activate')
  }

  /**
   * Executes a manual time out reversal.
   *
   * We love time out reversals. Don't be afraid to use them whenever a request to a
   * BlockChyp terminal times out. You have up to two minutes to reverse any transaction.
   * The only caveat is that you must assign transactionRef values when you build the
   * original request. Otherwise, we have no real way of knowing which transaction you're
   * trying to reverse because we may not have assigned it an id yet. And if we did assign it an
   * id, you wouldn't know what it is because your request to the terminal timed out before
   * you got a response.
   */
  reverse (request) {
    return this._gatewayPost('/reverse', request)
  }

  /**
   * Captures a preauthorization.
   */
  capture (request) {
    return this._gatewayPost('/capture', request)
  }

  /**
   * Closes the current credit card batch.
   */
  closeBatch (request) {
    return this._gatewayPost('/close-batch', request)
  }

  /**
   * Discards a previous preauth transaction.
   */
  void (request) {
    return this._gatewayPost('/void', request)
  }

  async routeTerminalPost (request, terminalPath, cloudPath) {
    if (this.isTerminalRouted(request)) {
      let route = await this._resolveTerminalRoute(request.terminalName)
      if (route && !route.cloudRelayEnabled) {
        return this._terminalPost(route, terminalPath, request)
      }
    }
    if (cloudPath) {
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
    }
    if (cloudPath) {
      return this._gatewayPut(cloudPath, request)
    }
    return this._gatewayPut(terminalPath, request)
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
      let decMatch = val.match(/\./g || [])
      if (decMatch && decMatch.length > 1) {
        return false
      }
      return true
    }
    return false
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
