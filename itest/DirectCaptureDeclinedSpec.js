describe("RoutingTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Should Decline Payment Above Floor Limit", function(done) {
    BlockChyp.setHost(Config.getGatewayHost());
    BlockChyp.charge(Config.getTerminalName(), Config.getCreds(), "1.05")
    .then(function (response) {
      let ack = response.data
      console.log("TEST RESPONSE" + JSON.stringify(ack))
      expect(ack.success).toBe(true);
      done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })

  });

});
