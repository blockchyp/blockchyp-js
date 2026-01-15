/**
 * Copyright 2019-2026 BlockChyp, Inc. All rights reserved. Use of this code is governed
 * by a license that can be found in the LICENSE file.
 *
 * This file was generated automatically by the BlockChyp SDK Generator. Changes to this
 * file will be lost every time the code is regenerated.
 */

describe('SubmitApplication', function () {
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

  it('can submit an application to add a new merchant', function (done) {
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
        message: 'Running SubmitApplication in ' + testDelay + ' seconds...'
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

    console.log('Running submitApplication...')

    setTimeout(function () {
      client = BlockChyp.newClient(Config.getCreds('partner'))
      client.setGatewayHost(Config.getGatewayHost())
      client.setTestGatewayHost(Config.getTestGatewayHost())
      client.setDashboardHost(Config.getDashboardHost())
      // setup request object
      let request = {
        test: true,
        inviteCode: 'asdf',
        dbaName: 'BlockChyp',
        corporateName: 'BlockChyp Inc.',
        webSite: 'https://www.blockchyp.com',
        taxIdNumber: '123456789',
        entityType: 'CORPORATION',
        stateOfIncorporation: 'UT',
        merchantType: 'RETAIL',
        businessDescription: 'Payment processing solutions',
        yearsInBusiness: '5',
        businessPhoneNumber: '5555551234',
        physicalAddress: {
          address1: '355 S 520 W',
          city: 'Lindon',
          stateOrProvince: 'UT',
          postalCode: '84042',
          countryCode: 'US',
        },
        mailingAddress: {
          address1: '355 S 520 W',
          city: 'Lindon',
          stateOrProvince: 'UT',
          postalCode: '84042',
          countryCode: 'US',
        },
        contactFirstName: 'John',
        contactLastName: 'Doe',
        contactPhoneNumber: '5555555678',
        contactEmail: 'john.doe@example.com',
        contactTitle: 'CEO',
        contactTaxIdNumber: '987654321',
        contactDOB: '1980-01-01',
        contactDlNumber: 'D1234567',
        contactDlStateOrProvince: 'NY',
        contactDlExpiration: '2025-12-31',
        contactHomeAddress: {
          address1: '355 S 520 W',
          city: 'Lindon',
          stateOrProvince: 'UT',
          postalCode: '84042',
          countryCode: 'US',
        },
        contactRole: 'OWNER',
        owners: [
          {
            firstName: 'John',
            lastName: 'Doe',
            jobTitle: 'CEO',
            taxIdNumber: '876543210',
            phoneNumber: '5555559876',
            dob: '1981-02-02',
            ownership: '50',
            email: 'john.doe@example.com',
            dlNumber: 'D7654321',
            dlStateOrProvince: 'UT',
            dlExpiration: '2024-12-31',
            address: {
              address1: '355 S 520 W',
              city: 'Lindon',
              stateOrProvince: 'UT',
              postalCode: '84042',
              countryCode: 'US',
            },
          },
        ],
        manualAccount: {
          name: 'Business Checking',
          bank: 'Test Bank',
          accountHolderName: 'BlockChyp Inc.',
          routingNumber: '124001545',
          accountNumber: '987654321',
        },
        averageTransaction: '100.00',
        highTransaction: '1000.00',
        averageMonth: '10000.00',
        highMonth: '20000.00',
        refundPolicy: '30_DAYS',
        refundDays: '30',
        timeZone: 'America/Denver',
        batchCloseTime: '23:59',
        multipleLocations: 'false',
        ebtRequested: 'false',
        ecommerce: 'true',
        cardPresentPercentage: '70',
        phoneOrderPercentage: '10',
        ecomPercentage: '20',
        signerName: 'John Doe',
      }

     client.submitApplication(request)
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
