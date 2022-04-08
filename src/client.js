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

/* eslint-disable no-unused-vars */
export const CardType = Object.freeze({
  CREDIT: 0,
  DEBIT: 1,
  EBT: 2,
  BLOCKCHAIN_GIFT: 3,
})

export const SignatureFormat = Object.freeze({
  NONE: '',
  PNG: 'png',
  JPG: 'jpg',
  GIF: 'gif',
})

export const PromptType = Object.freeze({
  AMOUNT: 'amount',
  EMAIL: 'email',
  PHONE_NUMBER: 'phone',
  CUSTOMER_NUMBER: 'customer-number',
  REWARDS_NUMBER: 'rewards-number',
  FIRST_NAME: 'first-name',
  LAST_NAME: 'last-name',
})

export const AVSResponse = Object.freeze({
  NOT_APPLICABLE: '',
  NOT_SUPPORTED: 'not_supported',
  RETRY: 'retry',
  NO_MATCH: 'no_match',
  ADDRESS_MATCH: 'address_match',
  POSTAL_CODE_MATCH: 'zip_match',
  ADDRESS_AND_POSTAL_CODE_MATCH: 'match',
})

export const CVMType = Object.freeze({
  SIGNATURE: 'Signature',
  OFFLINE_PIN: 'Offline PIN',
  ONLINE_PIN: 'Online PIN',
  CDCVM: 'CDCVM',
  NO_CVM: 'No CVM',
})
/* eslint-enable no-unused-vars */

const VERSION = require('../package.json').version
const USER_AGENT = `BlockChyp-JavaScript/${VERSION}`
// Some browsers do not allow setting the user-agent header, so we set
// an alternative if running from a browser.
const AGENT_HEADER = (typeof window === 'undefined') ? 'User-Agent' : 'X-Requested-With'

class BlockChypClient {
  constructor (creds) {
    this.gatewayHost = 'https://api.blockchyp.com'
    this.testGatewayHost = 'https://test.blockchyp.com'
    this.credentials = creds
    this.https = true
    this.cloudRelay = false
    this.routeCacheTTL = 60
    this.gatewayTimeout = 20
    this.terminalTimeout = 120
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
    return this._gatewayRequest('get', '/api/heartbeat')
  }

  /**
   * Tests connectivity with a payment terminal.
   */
  async ping (request) {
    return this.routeTerminalRequest('post', request, '/api/test', '/api/terminal-test')
  }

  /**
   * Executes a standard direct preauth and capture.
   */
  async charge (request) {
    return this.routeTerminalRequest('post', request, '/api/charge', '/api/charge')
  }

  /**
   * Executes a preauthorization intended to be captured later.
   */
  async preauth (request) {
    return this.routeTerminalRequest('post', request, '/api/preauth', '/api/preauth')
  }

  /**
   * Executes a refund.
   */
  async refund (request) {
    return this.routeTerminalRequest('post', request, '/api/refund', '/api/refund')
  }

  /**
   * Adds a new payment method to the token vault.
   */
  async enroll (request) {
    return this.routeTerminalRequest('post', request, '/api/enroll', '/api/enroll')
  }

  /**
   * Activates or recharges a gift card.
   */
  async giftActivate (request) {
    return this.routeTerminalRequest('post', request, '/api/gift-activate', '/api/gift-activate')
  }

  /**
   * Checks the remaining balance on a payment method.
   */
  async balance (request) {
    return this.routeTerminalRequest('post', request, '/api/balance', '/api/balance')
  }

  /**
   * Clears the line item display and any in progress transaction.
   */
  async clear (request) {
    return this.routeTerminalRequest('post', request, '/api/clear', '/api/terminal-clear')
  }

  /**
   * Returns the current status of a terminal.
   */
  async terminalStatus (request) {
    return this.routeTerminalRequest('post', request, '/api/terminal-status', '/api/terminal-status')
  }

  /**
   * Prompts the user to accept terms and conditions.
   */
  async termsAndConditions (request) {
    return this.routeTerminalRequest('post', request, '/api/tc', '/api/terminal-tc')
  }

  /**
   * Captures and returns a signature.
   */
  async captureSignature (request) {
    return this.routeTerminalRequest('post', request, '/api/capture-signature', '/api/capture-signature')
  }

  /**
   * Displays a new transaction on the terminal.
   */
  async newTransactionDisplay (request) {
    return this.routeTerminalRequest('post', request, '/api/txdisplay', '/api/terminal-txdisplay')
  }

  /**
   * Appends items to an existing transaction display. Subtotal, Tax, and Total are
   * overwritten by the request. Items with the same description are combined into
   * groups.
   */
  async updateTransactionDisplay (request) {
    return this.routeTerminalRequest('put', request, '/api/txdisplay', '/api/terminal-txdisplay')
  }

  /**
   * Displays a short message on the terminal.
   */
  async message (request) {
    return this.routeTerminalRequest('post', request, '/api/message', '/api/message')
  }

  /**
   * Asks the consumer a yes/no question.
   */
  async booleanPrompt (request) {
    return this.routeTerminalRequest('post', request, '/api/boolean-prompt', '/api/boolean-prompt')
  }

  /**
   * Asks the consumer a text based question.
   */
  async textPrompt (request) {
    return this.routeTerminalRequest('post', request, '/api/text-prompt', '/api/text-prompt')
  }

  /**
   * Returns a list of queued transactions on a terminal.
   */
  async listQueuedTransactions (request) {
    return this.routeTerminalRequest('post', request, '/api/queue/list', '/api/queue/list')
  }

  /**
   * Deletes a queued transaction from the terminal.
   */
  async deleteQueuedTransaction (request) {
    return this.routeTerminalRequest('post', request, '/api/queue/delete', '/api/queue/delete')
  }

  /**
   * Returns routing and location data for a payment terminal.
   */
  locate (request) {
    return this._gatewayRequest('post', '/api/terminal-locate', request)
  }

  /**
   * Captures a preauthorization.
   */
  capture (request) {
    return this._gatewayRequest('post', '/api/capture', request)
  }

  /**
   * Discards a previous transaction.
   */
  void (request) {
    return this._gatewayRequest('post', '/api/void', request)
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
    return this._gatewayRequest('post', '/api/reverse', request)
  }

  /**
   * Closes the current credit card batch.
   */
  closeBatch (request) {
    return this._gatewayRequest('post', '/api/close-batch', request)
  }

  /**
   * Creates and send a payment link to a customer.
   */
  sendPaymentLink (request) {
    return this._gatewayRequest('post', '/api/send-payment-link', request)
  }

  /**
   * Cancels a payment link.
   */
  cancelPaymentLink (request) {
    return this._gatewayRequest('post', '/api/cancel-payment-link', request)
  }

  /**
   * Retrieves the current status of a transaction.
   */
  transactionStatus (request) {
    return this._gatewayRequest('post', '/api/tx-status', request)
  }

  /**
   * Updates or creates a customer record.
   */
  updateCustomer (request) {
    return this._gatewayRequest('post', '/api/update-customer', request)
  }

  /**
   * Retrieves a customer by id.
   */
  customer (request) {
    return this._gatewayRequest('post', '/api/customer', request)
  }

  /**
   * Searches the customer database.
   */
  customerSearch (request) {
    return this._gatewayRequest('post', '/api/customer-search', request)
  }

  /**
   * Calculates the discount for actual cash transactions.
   */
  cashDiscount (request) {
    return this._gatewayRequest('post', '/api/cash-discount', request)
  }

  /**
   * Returns the batch history for a merchant.
   */
  batchHistory (request) {
    return this._gatewayRequest('post', '/api/batch-history', request)
  }

  /**
   * Returns the batch details for a single batch.
   */
  batchDetails (request) {
    return this._gatewayRequest('post', '/api/batch-details', request)
  }

  /**
   * Returns the transaction history for a merchant.
   */
  transactionHistory (request) {
    return this._gatewayRequest('post', '/api/tx-history', request)
  }

  /**
   * Returns profile information for a merchant.
   */
  merchantProfile (request) {
    return this._gatewayRequest('post', '/api/public-merchant-profile', request)
  }

  /**
   * Deletes a customer record.
   */
  deleteCustomer (request) {
    return this._gatewayRequest('delete', '/api/customer/' + request.customerId, request)
  }

  /**
   * Deletes a payment token.
   */
  deleteToken (request) {
    return this._gatewayRequest('delete', '/api/token/' + request.token, request)
  }

  /**
   * Retrieves payment token metadata.
   */
  tokenMetadata (request) {
    return this._gatewayRequest('get', '/api/token/' + request.token, request)
  }

  /**
   * Links a token to a customer record.
   */
  linkToken (request) {
    return this._gatewayRequest('post', '/api/link-token', request)
  }

  /**
   * Removes a link between a customer and a token.
   */
  unlinkToken (request) {
    return this._gatewayRequest('post', '/api/unlink-token', request)
  }

  async routeTerminalRequest (method, request, terminalPath, cloudPath) {
    if (this.isTerminalRouted(request)) {
      let route = await this._resolveTerminalRoute(request.terminalName)
      if (route && !route.cloudRelayEnabled) {
        return this._terminalRequest(method, route, terminalPath, request)
      }
    }
    if (cloudPath) {
      return this._relayRequest(method, cloudPath, request)
    }
    return this._gatewayRequest(method, terminalPath, request)
  }

  async routeTerminalPost (request, terminalPath, cloudPath) {
    return this.routeTerminalRequest('post', request, terminalPath, cloudPath)
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

  _relayRequest (method, path, request) {
    return this._gatewayRequest(method, path, request, true)
  }

  _gatewayRequest (method, path, request, relay) {
    let config = {
      method: method,
      url: this._assembleGatewayUrl(path, request),
      timeout: this._getTimeout(request, relay ? this.terminalTimeout : this.gatewayTimeout) * 1000,
      headers: {
        [AGENT_HEADER]: USER_AGENT,
        'Content-Type': 'application/json',
      },
    }

    if (method !== 'get') {
      config.data = request
    }

    if (this.credentials && this.credentials.apiKey) {
      config.headers = Object.assign(config.headers, CryptoUtils.generateGatewayHeaders(this.credentials))
    }

    return axios(config)
  }

  _getTimeout (request, defaultTimeout) {
    if (request && 'timeout' in request) {
      return request['timeout']
    }

    return defaultTimeout
  }

  _assembleGatewayUrl (path, payload) {
    let result = ''
    if (payload && payload.test) {
      result = result + this.testGatewayHost
    } else {
      result = result + this.gatewayHost
    }
    result = result + path
    return result
  }

  async _terminalRequest (method, route, path, request) {
    let url = await this._assembleTerminalUrl(route, path)

    let config = {
      method: method,
      url: url,
      headers: {
        [AGENT_HEADER]: USER_AGENT,
        'Content-Type': 'application/json',
      },
      timeout: this._getTimeout(request, this.terminalTimeout) * 1000,
    }
    if (this.https) {
      if (nodeHttps) {
        config.httpsAgent = new nodeHttps.Agent({
          rejectUnauthorized: false
        })
      } else {
        config.httpsAgent = new browserifyHttps.Agent({
          rejectUnauthorized: false
        })
        config.httpsAgent.protocol = 'https:'
      }
    }

    if (request) {
      config.data = {
        apiKey: route.transientCredentials.apiKey,
        bearerToken: route.transientCredentials.bearerToken,
        signingKey: route.transientCredentials.signingKey,
        request: request,
      }
    }

    return axios(config)
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

    let routeResponse = await this._gatewayRequest('get', '/api/terminal-route?terminal=' + terminalName)
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

export function newClient (creds) {
  return BlockChyp.newClient(creds)
}
