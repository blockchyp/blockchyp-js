/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */

describe("TerminalPreauth", function() {
  var uuidv4 = require('uuid/v4');
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;
  var PromptType = require('../dist/client.js').PromptType;
  var CardType = require('../dist/client.js').CardType;
  var SignatureFormat = require('../dist/client.js').SignatureFormat;
  var lastTransactionId, lastTransactionRef;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Can process a preauthorization using a terminal", function(done) {

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
        message: 'Running TerminalPreauth in ' + testDelay + ' seconds...'
      }
      client.message(messageRequest)
        .then(function (httpResponse) {
          let response = httpResponse.data
          expect(response.success).toBe(true)
        })
        .catch(function (error) {
          console.log("Error:", error)
          done()
        })
    }

    setTimeout( function() {

      // setup request object
      let request = {
      terminalName: 'Test Terminal',
      amount: '15.15',
      test: true,
    }

      client.preauth(request)
        .then(function (httpResponse) {
          let response = httpResponse.data
          console.log('TEST RESPONSE:' + JSON.stringify(response))

          // response assertions
          expect(response.success).toBe(true)
          expect(response.approved).toBe(true)
          expect(response.test).toBe(true)

          expect(response.authCode.length).toBe(6)

          expect(response.transactionId.trim().length).toBeGreaterThan(0)

          expect(response.timestamp.trim().length).toBeGreaterThan(0)

          expect(response.tickBlock.trim().length).toBeGreaterThan(0)

          expect(response.responseDescription).toEqual('approved')

          expect(response.paymentType.trim().length).toBeGreaterThan(0)

          expect(response.maskedPan.trim().length).toBeGreaterThan(0)

          expect(response.entryMethod.trim().length).toBeGreaterThan(0)

          expect(response.authorizedAmount).toEqual('15.15')
          done()
        })
        .catch(function (error) {
          console.log('Error:', error)
          done()
        })

      }, testDelayInt * 1000);
  });

});
