describe("HeartbeatTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  it("Should Route By Terminal Name", function(done) {
    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())
    client.https = false

    client.heartbeat()
    .then(function (response) {
      let ack = response.data
      console.log("TEST RESPONSE" + JSON.stringify(ack))
      expect(ack.success).toBe(true);
      expect(ack.merchantPk).toBeDefined();
      done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })
  });

});
