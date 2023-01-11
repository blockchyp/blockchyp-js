/**
 * Copyright 2019-2023 BlockChyp, Inc. All rights reserved. Use of this code is governed
 * by a license that can be found in the LICENSE file.
 *
 * This file was generated automatically by the BlockChyp SDK Generator. Changes to this
 * file will be lost every time the code is regenerated.
 */

describe('SendPaymentLink', function () {
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

  it('can generate a payment link', function (done) {
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
        message: 'Running SendPaymentLink in ' + testDelay + ' seconds...'
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

    console.log('Running sendPaymentLink...')

    setTimeout(function () {
      client = BlockChyp.newClient(Config.getCreds(''))
      client.setGatewayHost(Config.getGatewayHost())
      client.setTestGatewayHost(Config.getTestGatewayHost())
      client.setDashboardHost(Config.getDashboardHost())
      // setup request object
      let request = {
        amount: '199.99',
        description: 'Widget',
        subject: 'Widget invoice',
        transaction: {
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
        customer: {
          customerRef: 'Customer reference string',
          firstName: 'FirstName',
          lastName: 'LastName',
          companyName: 'Company Name',
          emailAddress: 'notifications@blockchypteam.m8r.co',
          smsNumber: '(123) 123-1231',
        },
      }

     client.sendPaymentLink(request)
      .then(function (httpResponse) {
          let response = httpResponse.data
          // console.log('TEST RESPONSE:' + JSON.stringify(response))

          // response assertions
          expect(response.success).toBe(true)
          expect(response.url.trim().length).toBeGreaterThan(0)
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
