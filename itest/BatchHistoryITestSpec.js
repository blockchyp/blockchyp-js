/**
 * Copyright 2019-2022 BlockChyp, Inc. All rights reserved. Use of this code is governed
 * by a license that can be found in the LICENSE file.
 *
 * This file was generated automatically by the BlockChyp SDK Generator. Changes to this
 * file will be lost every time the code is regenerated.
 */

describe('BatchHistory', function () {
  var uuidv4 = require('uuid/v4');
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../index.js');
  var lastTransactionId, lastTransactionRef, lastCustomerId, lastToken;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it('can retrieve transaction history', function (done) {
    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())

    var testDelay = process.env.BC_TEST_DELAY
    var testDelayInt = 0
    if (testDelay) {
      testDelayInt = parseInt(testDelay)
    }

    if (testDelay > 0) {
      var messageRequest = {
        test: true,
        terminalName: Config.getTerminalName(),
        message: 'Running BatchHistory in ' + testDelay + ' seconds...'
      }
      client.message(messageRequest)
        .then(function (httpResponse) {
          let response = httpResponse.data
          expect(response.success).toBe(true)
        })
        .catch(function (error) {
          console.log('Error:', error)
          done()
        })
    }

    setTimeout(function () {
      let request0 = {
        pan: '4111111111111111',
        expMonth: '12',
        expYear: '2025',
        amount: '25.55',
        test: true,
        transactionRef: uuidv4(),
      }
      client.charge(request0)
        .then(function (httpResponse) {
          let response = httpResponse.data
          console.log('SETUP TEST RESPONSE' + JSON.stringify(response))
          if (response.transactionId) {
            lastTransactionId = response.transactionId
          }
          if (response.transactionRef) {
            lastTransactionRef = response.transactionRef
          }
          if (response.customer && response.customer.id) {
            lastCustomerId = response.customer.id
          }
          if (response.token) {
            lastToken = response.token
          }

          // setup request object
          let request = {
            maxResults: 10,
          }
          return client.batchHistory(request)
        })
        .then(function (httpResponse) {
          let response = httpResponse.data
          console.log('TEST RESPONSE' + JSON.stringify(response))
          // response assertions
          expect(response.success).toBe(true)
          done()
        })
        .catch(function (error) {
          console.log('Error:', error)
          done()
        })


    }, testDelayInt * 1000);
  });
});
