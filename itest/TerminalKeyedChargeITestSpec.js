/**
 * Copyright 2019 BlockChyp, Inc. All rights reserved. Use of this code is governed by a
 * license that can be found in the LICENSE file.
 *
 * This file was generated automatically. Changes to this file will be lost every time the
 * code is regenerated.
 */
describe("TerminalKeyedCharge", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;
  var lastTransactionId, lastTransactionRef;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Can process an keyed charge with a terminal", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())

        // setup request object
    let request = {
      terminalName: "Test Terminal",
      amount: "11.11",
      manualEntry: true,
      test: true,
    }

    client.charge(request)
    .then(function (httpResponse) {
      let response = httpResponse.data
      console.log("TEST RESPONSE" + JSON.stringify(response))

      // response assertions
    expect(response.approved).toBe(true)
    expect(response.test).toBe(true)

    expect(response.authCode.length).toBe(6)

    expect(response.transactionId.trim().length).toBeGreaterThan(0)

    expect(response.timestamp.trim().length).toBeGreaterThan(0)

    expect(response.tickBlock.trim().length).toBeGreaterThan(0)

    expect(response.responseDescription).toEqual("Approved")

    expect(response.paymentType.trim().length).toBeGreaterThan(0)

    expect(response.maskedPan.trim().length).toBeGreaterThan(0)

    expect(response.entryMethod.trim().length).toBeGreaterThan(0)

    expect(response.authorizedAmount).toEqual("11.11")
    done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })
  });

});
