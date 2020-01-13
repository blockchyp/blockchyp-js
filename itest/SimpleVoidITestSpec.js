/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */

describe("SimpleVoid", function() {
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

  it("Can void a tranaction in the current batch", function(done) {

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
        message: 'Running SimpleVoid in ' + testDelay + ' seconds...'
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

    let request0 = {
        pan: '4111111111111111',
        amount: '25.55',
        test: true,
        transactionRef: uuidv4(),
    }
    response0 = client.charge(request0)
    .then(function (httpResponse) {
      let response0 = httpResponse.data
      console.log("SETUP TEST RESPONSE" + JSON.stringify(response0))
      if (response0.transactionId) {
        lastTransactionId = response0.transactionId
      }
      if (response0.transactionRef) {
        lastTransactionRef = response0.transactionRef
      }
      // setup request object
      let request = {
        transactionId: lastTransactionId,
        test: true,
      }
      client.void(request)
      .then(function (httpResponse) {
        let response = httpResponse.data
        console.log("TEST RESPONSE" + JSON.stringify(response))
        // response assertions
          expect(response.approved).toBe(true)
          done()
      })
      .catch(function (error) {
        console.log("Error:", error)
        done()
      })
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })


      }, testDelayInt * 1000);
  });

});
