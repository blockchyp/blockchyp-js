describe("DirectTerminalTestConfig", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  it("TerminalTestAPI", function(done) {
    BlockChyp.setHost(Config.getGatewayHost());
    BlockChyp.test(Config.getTerminalAddress(), Config.getCreds())
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
