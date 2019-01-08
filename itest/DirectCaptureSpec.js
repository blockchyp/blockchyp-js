describe("RoutingTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Should Capture Payment Above Floor Limit", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())

    let request = {
      terminalName: Config.getTerminalName(),
      amount: "10.00"
    }

    client.charge(request)
    .then(function (response) {
      let authResponse = response.data
      console.log("TEST RESPONSE" + JSON.stringify(authResponse))
      expect(authResponse.approved).toBe(true);
      done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })

  });

});
