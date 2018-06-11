describe("RoutingTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  it("Should Route By Terminal Name", function(done) {
    BlockChyp.setHost(Config.getGatewayHost());
    BlockChyp.test(Config.getTerminalName(), Config.getCreds())
    .then(function (response) {
      let ack = response.data
      console.log("TEST RESPONSE" + JSON.stringify(ack))
      expect(ack.success).toBe(true);
      //do the test again to check for cached route
      BlockChyp.test(Config.getTerminalName(), Config.getCreds())
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
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })

  });

});
