/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */

describe("SendPaymentLink", function() {
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

  it("can generate a payment link", function(done) {

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
        message: 'Running SendPaymentLink in ' + testDelay + ' seconds...'
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
      amount: '199.99',
      description: 'Widget',
      subject: 'Widget invoice',
      transaction:   {
      subtotal: '195.00',
      tax: '4.99',
      total: '199.99',
      items: [
        {
          description: 'Widget',
          price: '195.00',
          quantity: 1,
  	  },
	  ],
  },
      autoSend: true,
      customer:   {
      customerRef: 'Customer reference string',
      firstName: 'FirstName',
      lastName: 'LastName',
      companyName: 'Company Name',
      emailAddress: 'support@blockchyp.com',
      smsNumber: '(123) 123-1231',
  },
    }

      client.sendPaymentLink(request)
        .then(function (httpResponse) {
          let response = httpResponse.data
          console.log('TEST RESPONSE:' + JSON.stringify(response))

          // response assertions
          expect(response.success).toBe(true)

          expect(response.url.trim().length).toBeGreaterThan(0)
          done()
        })
        .catch(function (error) {
          console.log('Error:', error)
          done()
        })

      }, testDelayInt * 1000);
  });

});
