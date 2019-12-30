/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */
describe("BooleanPrompt", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;
  var lastTransactionId, lastTransactionRef;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Can prompt the consumer for boolean input", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())

        // setup request object
    let request = {
      test: true,
      terminalName: "Test Terminal",
      prompt: "Would you like to become a member?",
      yesCaption: "Yes",
      noCaption: "No",
    }

    client.booleanPrompt(request)
    .then(function (httpResponse) {
      let response = httpResponse.data
      console.log("TEST RESPONSE" + JSON.stringify(response))

      // response assertions
    expect(response.success).toBe(true)
    expect(response.response).toBe(true)
    done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })
  });

});
