describe("VerifyTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  it("Should Verify By Track Data", function(done) {
    BlockChyp.setHost(Config.getGatewayHost());

    let request = {
      trackData: 'B5541032000004422^TOM/BRONSON^2512101000003280'
    }

    BlockChyp.verify(Config.getCreds(), request)
    .then(function (response) {
      let ack = response.data
      console.log("TEST RESPONSE" + JSON.stringify(ack))
      expect(ack.success).toBe(true);
      expect(ack.authCode).not.toBeNull();
      done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })
  });

});
