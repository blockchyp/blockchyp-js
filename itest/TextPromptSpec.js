describe("RoutingTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Should Capture A Text Prompt", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())

    let request = {
      terminalName: Config.getTerminalName(),
      test: true,
      promptType: "email"
    }

    client.textPrompt(request)
    .then(function (response) {
      let innerResponse = response.data
      console.log("TEST RESPONSE" + JSON.stringify(innerResponse))
      expect(innerResponse.success).toBe(true);
      done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })

  });

});
