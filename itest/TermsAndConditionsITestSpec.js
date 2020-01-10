/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */

describe("TermsAndConditions", function() {
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

  it("Can capture terms and conditions acceptance", function(done) {

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
        message: 'Running TermsAndConditions in ' + testDelay + ' seconds...'
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
      test: true,
      terminalName: "Test Terminal",
      tcName: "HIPPA Disclosure",
      tcContent: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ullamcorper id urna quis pulvinar. Pellentesque vestibulum justo ac nulla consectetur tristique. Suspendisse arcu arcu, viverra vel luctus non, dapibus vitae augue. Aenean ac volutpat purus. Curabitur in lacus nisi. Nam vel sagittis eros. Curabitur faucibus ut nisl in pulvinar. Nunc egestas, orci ut porttitor tempus, ante mauris pellentesque ex, nec feugiat purus arcu ac metus. Cras sodales ornare lobortis. Aenean lacinia ultricies purus quis pharetra. Cras vestibulum nulla et magna eleifend eleifend. Nunc nibh dolor, malesuada ut suscipit vitae, bibendum quis dolor. Phasellus ultricies ex vitae dolor malesuada, vel dignissim neque accumsan.",
      sigFormat: SignatureFormat.PNG,
      sigWidth: 200,
      sigRequired: true,
    }

      client.termsAndConditions(request)
        .then(function (httpResponse) {
          let response = httpResponse.data
          console.log('TEST RESPONSE:' + JSON.stringify(response))

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
