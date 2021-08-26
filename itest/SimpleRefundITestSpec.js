/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */

describe('SimpleRefund', function () {
  var uuidv4 = require('uuid/v4');
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../index.js');
  var lastTransactionId, lastTransactionRef, lastCustomerId;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it('Can execute a simple refund', function (done) {
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
        terminalName: 'Test Terminal',
        message: 'Running SimpleRefund in ' + testDelay + ' seconds...'
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
      let response0 = client.charge(request0)
        .then(function (httpResponse) {
          let response0 = httpResponse.data
          console.log('SETUP TEST RESPONSE' + JSON.stringify(response0))
          if (response0.transactionId) {
            lastTransactionId = response0.transactionId
          }
          if (response0.transactionRef) {
            lastTransactionRef = response0.transactionRef
          }
          if (response0.customerId) {
            lastCustomerId = response0.customerId
          }
          // setup request object
          let request = {
            transactionId: lastTransactionId,
            amount: '5.00',
            test: true,
          }
          client.refund(request)
            .then(function (httpResponse) {
              let response = httpResponse.data
              console.log('TEST RESPONSE' + JSON.stringify(response))
              // response assertions
              expect(response.success).toBe(true)
              expect(response.approved).toBe(true)
              done()
            })
            .catch(function (error) {
              console.log('Error:', error)
              done()
            })
        })
        .catch(function (error) {
          console.log('Error:', error)
          done()
        })

    }, testDelayInt * 1000);
  });
});
