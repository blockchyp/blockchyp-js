/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */

describe('LinkToken', function () {
  var uuidv4 = require('uuid/v4');
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../index.js');
  var lastTransactionId, lastTransactionRef, lastCustomerId, lastToken;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it('can link a token with a customer record', function (done) {
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
        message: 'Running LinkToken in ' + testDelay + ' seconds...'
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
        test: true,
        customer: {
          customerRef: 'TESTCUSTOMER',
          firstName: 'Test',
          lastName: 'Customer',
        },
      }
      client.enroll(request0)
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
            token: lastToken,
            customerId: lastCustomerId,
          }
          return client.linkToken(request)
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
