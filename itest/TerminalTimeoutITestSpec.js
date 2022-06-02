/**
 * Copyright 2019-2022 BlockChyp, Inc. All rights reserved. Use of this code is governed
 * by a license that can be found in the LICENSE file.
 *
 * This file was generated automatically by the BlockChyp SDK Generator. Changes to this
 * file will be lost every time the code is regenerated.
 */

describe('TerminalTimeout', function () {
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

  it('Can specify terminal request timeouts.', function (done) {
    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())
    client.setDashboardHost(Config.getDashboardHost())

    var testDelay = process.env.BC_TEST_DELAY
    var testDelayInt = 0
    if (testDelay) {
      testDelayInt = parseInt(testDelay)
    }



    if (testDelay > 0) {
      var messageRequest = {
        test: true,
        terminalName: Config.getTerminalName(),
        message: 'Running TerminalTimeout in ' + testDelay + ' seconds...'
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

    console.log('Running terminalTimeout...')

    setTimeout(function () {
      client = BlockChyp.newClient(Config.getCreds(''))
      client.setGatewayHost(Config.getGatewayHost())
      client.setTestGatewayHost(Config.getTestGatewayHost())
      client.setDashboardHost(Config.getDashboardHost())
      // setup request object
      let request = {
        timeout: 1,
        terminalName: Config.getTerminalName(),
        amount: '25.15',
        test: true,
      }

      client.charge(request)
        .then(function (httpResponse) {
          fail('Request should time out')
          done()
        })
        .catch(function (error) {
          done()
        })

    }, testDelayInt * 1000);
  });
});
