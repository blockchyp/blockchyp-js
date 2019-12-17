describe("TerminalClear", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;
  var lastTransactionId, lastTransactionRef;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Can clear and reset the terminal", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())

    // setup request object
    let request = {
      test: true ,
      terminalName: "Test Terminal" ,
    }

    client.clear(request)
    .then(function (httpResponse) {
      let response = httpResponse.data
      console.log("TEST RESPONSE" + JSON.stringify(response))

      // response assertions
  
    
    expect(response.success).toBe(true)
    
    
    
    
    
    
  
    done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })
  
  });

});
