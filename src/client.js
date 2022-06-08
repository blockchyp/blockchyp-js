/**
 * Copyright 2019-2022 BlockChyp, Inc. All rights reserved. Use of this code is governed
 * by a license that can be found in the LICENSE file.
 *
 * This file was generated automatically by the BlockChyp SDK Generator. Changes to this
 * file will be lost every time the code is regenerated.
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
  HEALTHCARE: 4,
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

export const HealthcareType = Object.freeze({
    HEALTHCARE: 'healthcare',
    PRESCRIPTION: 'prescription',
    VISION: 'vision',
    CLINIC: 'clinic',
    DENTAL: 'dental',
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
    this.dashboardHost = 'https://dashboard.blockchyp.com'
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

  getDashboardHost () {
    return this.dashboardHost
  }

  setGatewayHost (host) {
    this.gatewayHost = host
  }

  setDashboardHost (host) {
    this.dashboardHost = host
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

  /**
   * Deletes a payment token.
   */
  deleteToken (request) {
    return this._gatewayRequest('delete', '/api/token/' + request.token, request)
  }

  /**
   * Adds a test merchant account.
   */
  getMerchants (request) {
    return this._dashboardRequest('post', '/api/get-merchants', request)
  }

  /**
   * Adds or updates a merchant account. Can be used to create or update test merchants.
   * Only gateway only partners may create new live merchants.
   */
  updateMerchant (request) {
    return this._dashboardRequest('post', '/api/update-merchant', request)
  }

  /**
   * List all active users and pending invites for a merchant account.
   */
  merchantUsers (request) {
    return this._dashboardRequest('post', '/api/merchant-users', request)
  }

  /**
   * Invites a user to join a merchant account.
   */
  inviteMerchantUser (request) {
    return this._dashboardRequest('post', '/api/invite-merchant-user', request)
  }

  /**
   * Adds a test merchant account.
   */
  addTestMerchant (request) {
    return this._dashboardRequest('post', '/api/add-test-merchant', request)
  }

  /**
   * Deletes a test merchant account. Supports partner scoped API credentials only. Live
   * merchant accounts cannot be deleted.
   */
  deleteTestMerchant (request) {
    return this._dashboardRequest('delete', '/api/test-merchant/' + request.merchantId, request)
  }

  /**
   * List all merchant platforms configured for a gateway merchant.
   */
  merchantPlatforms (request) {
    return this._dashboardRequest('get', '/api/plugin-configs/' + request.merchantId, request)
  }

  /**
   * List all merchant platforms configured for a gateway merchant.
   */
  updateMerchantPlatforms (request) {
    return this._dashboardRequest('post', '/api/plugin-configs', request)
  }

  /**
   * Deletes a boarding platform configuration.
   */
  deleteMerchantPlatforms (request) {
    return this._dashboardRequest('delete', '/api/plugin-config/' + request.platformId, request)
  }

  /**
   * Returns all terminals associated with the merchant account.
   */
  terminals (request) {
    return this._dashboardRequest('get', '/api/terminals', request)
  }

  /**
   * Deactivates a terminal.
   */
  deactivateTerminal (request) {
    return this._dashboardRequest('delete', '/api/terminal/' + request.terminalId, request)
  }

  /**
   * Activates a terminal.
   */
  activateTerminal (request) {
    return this._dashboardRequest('post', '/api/terminal-activate', request)
  }

  /**
   * Returns a list of terms and conditions templates associated with a merchant account.
   */
  tcTemplates (request) {
    return this._dashboardRequest('get', '/api/tc-templates', request)
  }

  /**
   * Returns a single terms and conditions template.
   */
  tcTemplate (request) {
    return this._dashboardRequest('get', '/api/tc-templates/' + request.templateId, request)
  }

  /**
   * Updates or creates a terms and conditions template.
   */
  tcUpdateTemplate (request) {
    return this._dashboardRequest('post', '/api/tc-templates', request)
  }

  /**
   * Deletes a single terms and conditions template.
   */
  tcDeleteTemplate (request) {
    return this._dashboardRequest('delete', '/api/tc-templates/' + request.templateId, request)
  }

  /**
   * Returns up to 250 entries from the Terms and Conditions log.
   */
  tcLog (request) {
    return this._dashboardRequest('post', '/api/tc-log', request)
  }

  /**
   * Returns a single detailed Terms and Conditions entry.
   */
  tcEntry (request) {
    return this._dashboardRequest('get', '/api/tc-entry/' + request.logEntryId, request)
  }

  /**
   * Returns all survey questions for a given merchant.
   */
  surveyQuestions (request) {
    return this._dashboardRequest('get', '/api/survey-questions', request)
  }

  /**
   * Returns a single survey question with response data.
   */
  surveyQuestion (request) {
    return this._dashboardRequest('get', '/api/survey-questions/' + request.questionId, request)
  }

  /**
   * Updates or creates a survey question.
   */
  updateSurveyQuestion (request) {
    return this._dashboardRequest('post', '/api/survey-questions', request)
  }

  /**
   * Deletes a survey question.
   */
  deleteSurveyQuestion (request) {
    return this._dashboardRequest('delete', '/api/survey-questions/' + request.questionId, request)
  }

  /**
   * Returns results for a single survey question.
   */
  surveyResults (request) {
    return this._dashboardRequest('post', '/api/survey-results', request)
  }

  /**
   * Returns the media library for a given partner, merchant, or organization.
   */
  media (request) {
    return this._dashboardRequest('get', '/api/media', request)
  }

  /**
   * Uploads a media asset to the media library.
   */
  uploadMedia (request, content) {
    return this._uploadRequest('/api/upload-media', request, content)
  }
  /**
   * Retrieves the current status of a file upload.
   */
  uploadStatus (request) {
    return this._dashboardRequest('get', '/api/media-upload/' + request.uploadId, request)
  }

  /**
   * Returns the media details for a single media asset.
   */
  mediaAsset (request) {
    return this._dashboardRequest('get', '/api/media/' + request.mediaId, request)
  }

  /**
   * Deletes a media asset.
   */
  deleteMediaAsset (request) {
    return this._dashboardRequest('delete', '/api/media/' + request.mediaId, request)
  }

  /**
   * Returns a collection of slide shows.
   */
  slideShows (request) {
    return this._dashboardRequest('get', '/api/slide-shows', request)
  }

  /**
   * Returns a single slide show with slides.
   */
  slideShow (request) {
    return this._dashboardRequest('get', '/api/slide-shows/' + request.slideShowId, request)
  }

  /**
   * Updates or creates a slide show.
   */
  updateSlideShow (request) {
    return this._dashboardRequest('post', '/api/slide-shows', request)
  }

  /**
   * Deletes a single slide show.
   */
  deleteSlideShow (request) {
    return this._dashboardRequest('delete', '/api/slide-shows/' + request.slideShowId, request)
  }

  /**
   * Returns the terminal branding stack for a given set of API credentials.
   */
  terminalBranding (request) {
    return this._dashboardRequest('get', '/api/terminal-branding', request)
  }

  /**
   * Updates a branding asset.
   */
  updateBrandingAsset (request) {
    return this._dashboardRequest('post', '/api/terminal-branding', request)
  }

  /**
   * Deletes a branding asset.
   */
  deleteBrandingAsset (request) {
    return this._dashboardRequest('delete', '/api/terminal-branding/' + request.assetId, request)
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

  _uploadRequest (path, request, content) {
    let config = {
      method: 'post',
      url: this._assembleDashboardUrl(path),
      timeout: this._getTimeout(request, this.gatewayTimeout) * 1000,
      headers: {
        [AGENT_HEADER]: USER_AGENT,
      },
    }

    config.data = content

    if (this.credentials && this.credentials.apiKey) {
      config.headers = Object.assign(config.headers, CryptoUtils.generateGatewayHeaders(this.credentials))
    }
    if (request.fileSize) {
      config.headers['X-File-Size'] = request.fileSize.toFixed()
    }
    if (request.fileName) {
      config.headers['X-Upload-File-Name'] = request.fileName
    }
    if (request.uploadId) {
      config.headers['X-Upload-ID'] = request.uploadId
    }

    return axios(config)
  }

  _dashboardRequest (method, path, request) {
    let config = {
      method: method,
      url: this._assembleDashboardUrl(path),
      timeout: this._getTimeout(request, this.gatewayTimeout) * 1000,
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

  _assembleDashboardUrl (path) {
    return this.dashboardHost + path
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
