/**
 * Copyright 2019-2026 BlockChyp, Inc. All rights reserved. Use of this code is governed
 * by a license that can be found in the LICENSE file.
 *
 * This file was generated automatically by the BlockChyp SDK Generator. Changes to this
 * file will be lost every time the code is regenerated.
 */

describe('ListTerminals', function () {
  var uuidv4 = require('uuid/v4');
  var fs = require('fs');
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../index.js');
  var lastTransactionId, lastTransactionRef, lastCustomerId, lastToken, uploadId;

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it('lists all terminals associated with an account.', function (done) {
    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())
    client.setDashboardHost(Config.getDashboardHost())

    var testDelay = process.env.BC_TEST_DELAY
    var testDelayInt = 0
    if (testDelay) {
      testDelayInt = parseInt(testDelay)
    }


    testDelay = 0


    if (testDelay > 0) {
      var messageRequest = {
        test: true,
        terminalName: Config.getTerminalName(),
        message: 'Running ListTerminals in ' + testDelay + ' seconds...'
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

    console.log('Running listTerminals...')

    setTimeout(function () {
      client = BlockChyp.newClient(Config.getCreds(''))
      client.setGatewayHost(Config.getGatewayHost())
      client.setTestGatewayHost(Config.getTestGatewayHost())
      client.setDashboardHost(Config.getDashboardHost())
      // setup request object
      let request = {
      }

     client.terminals(request)
      .then(function (httpResponse) {
          let response = httpResponse.data
          // console.log('TEST RESPONSE:' + JSON.stringify(response))

          // response assertions
          expect(response.success).toBe(true)
          done()
        })
        .catch(function (error) {
          console.log('Error:', error)
          fail(error)
          done()
        })
    }, testDelayInt * 1000);
  });
});
