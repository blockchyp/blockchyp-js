/**
 * Copyright 2019-2026 BlockChyp, Inc. All rights reserved. Use of this code is governed
 * by a license that can be found in the LICENSE file.
 *
 * This file was generated automatically by the BlockChyp SDK Generator. Changes to this
 * file will be lost every time the code is regenerated.
 */

describe('TerminalQueuedTransaction', function () {
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

  it('Queues a terminal for later processing on a terminal', function (done) {
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
        message: 'Running TerminalQueuedTransaction in ' + testDelay + ' seconds...'
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

    console.log('Running terminalQueuedTransaction...')

    setTimeout(function () {
      client = BlockChyp.newClient(Config.getCreds(''))
      client.setGatewayHost(Config.getGatewayHost())
      client.setTestGatewayHost(Config.getTestGatewayHost())
      client.setDashboardHost(Config.getDashboardHost())
      // setup request object
      let request = {
        terminalName: Config.getTerminalName(),
        transactionRef: uuidv4(),
        description: '1060 West Addison',
        amount: '25.15',
        test: true,
        queue: true,
      }

     client.charge(request)
      .then(function (httpResponse) {
          let response = httpResponse.data
          // console.log('TEST RESPONSE:' + JSON.stringify(response))

          // response assertions
          expect(response.success).toBe(true)
          expect(response.approved).toBe(false)
          expect(response.responseDescription).toEqual('Queued')
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
