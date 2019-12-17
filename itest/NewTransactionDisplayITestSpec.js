describe("NewTransactionDisplay", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;
  var lastTransactionId, lastTransactionRef;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Can reset transaction line item display", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())

    // setup request object
    let request = {
      test: true ,
      terminalName: "Test Terminal" ,
      transaction: 	{
    	subtotal: "35.00" ,
    	tax: "5.00" ,
    	total: "70.00" ,
    	items: [
    		{
      		description: "Leki Trekking Poles" ,
      		price: "35.00" ,
      		quantity: 2 ,
      		extended: "70.00" ,
      		discounts: [
    			{
      			description: "memberDiscount" ,
      			amount: "10.00" ,
  			},
			],
  		},
		],
	},
    }

    client.newTransactionDisplay(request)
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
