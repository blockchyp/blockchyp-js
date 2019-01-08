describe("RoutingTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Should Test Terminal Communication", function(done) {
    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.ping(Config.getTerminalName())
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
