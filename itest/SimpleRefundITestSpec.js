describe("SimpleRefund", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;
  var lastTransactionId, lastTransactionRef;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Can execute a simple refund", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())

    let request0 = {
        pan: "4111111111111111" ,
        amount: "25.55" ,
        test: true ,
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
        transactionId: lastTransactionId ,
        test: true ,
      }
      client.refund(request)
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
  });

});
