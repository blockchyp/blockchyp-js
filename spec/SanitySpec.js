describe("SanityTest", function() {
  var BlockChyp = require('../dist/client.js').default;

  it("Should Exist", function() {
    expect(BlockChyp).toBeDefined();
  });

  it("Should Fetch Heatbeat", function(done) {
    BlockChyp.setGatewayHost('https://api.blockchyp.com/');
    BlockChyp.heartbeat()
      .then(function (response) {
        let hb = response.data
        expect(hb.success).toBe(true);
        expect(hb.timestamp).toBeDefined();
        expect(hb.latestTick).toBeDefined();
        done()
      })
      .catch(function (error) {
        console.log("Error:", error)
        done()
      })
  });

});
