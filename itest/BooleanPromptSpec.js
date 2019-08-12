describe("RoutingTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Should Capture A Yes/No Answer", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())
    let request = {
      terminalName: Config.getTerminalName(),
      test: true,
      prompt: "Is OpenEdge slower than Christmas?",
      yesCaption: "ALWAYS",
      noCaption: "MMM..."
    }

    client.booleanPrompt(request)
    .then(function (response) {
      let msgResponse = response.data
      console.log("TEST RESPONSE" + JSON.stringify(msgResponse))
      expect(msgResponse.success).toBe(true);
      expect(msgResponse.response).toBe(true);
      done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })

  });

});
