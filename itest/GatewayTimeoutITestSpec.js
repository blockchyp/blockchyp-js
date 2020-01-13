/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */

describe("GatewayTimeout", function() {
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

  it("Can specify gateway request timeouts.", function(done) {

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
        message: 'Running GatewayTimeout in ' + testDelay + ' seconds...'
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
      timeout: 1,
      pan: '5555555555554444',
      amount: '25.55',
      test: true,
      transactionRef: uuidv4(),
    }

      client.charge(request)
        .then(function (httpResponse) {
          fail('Request should time out')
          done()
        })
        .catch(function (error) {
          console.log('Error:', error)
          expect(error).toEqual(new Error('timeout of 1000ms exceeded'))
          done()
        })

      }, testDelayInt * 1000);
  });

});
