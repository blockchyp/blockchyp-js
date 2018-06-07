describe("HeartbeatTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  it("Should Route By Terminal Name", function(done) {
    BlockChyp.setHost(Config.getGatewayHost());
    BlockChyp.heartbeat(Config.getCreds())
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
