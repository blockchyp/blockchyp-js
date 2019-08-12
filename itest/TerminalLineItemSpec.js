describe("RoutingTest", function() {
  var Config = require('../itest/support/config').config;
  Config.load();
  var BlockChyp = require('../dist/client.js').default;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  });

  it("Should Display Line Items On The Terminal", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())

    let request = {
      terminalName: Config.getTerminalName(),
      test: true,
      transaction: {
        "items": [
          {
            "id": "test-item-1",
            "description": "Quality Nachos",
            "price": "3.50",
            "quantity": 1,
            "extended": "3.50"
          },
          {
            "id": "test-item-2",
            "description": "Chicken Tendies",
            "price": "6.50",
            "quantity": 1,
            "extended": "6.50"
          }
        ],
        "subtotal": "10.00",
        "tax": "1.50",
        "total": "11.50"
      }
    }

    client.newTransactionDisplay(request)
    .then(function (response) {
      let msgResponse = response.data
      console.log("TEST RESPONSE" + JSON.stringify(msgResponse))
      expect(msgResponse.success).toBe(true);
      done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })

  });

  it("Should Update Line Items On The Terminal", function(done) {

    var client = BlockChyp.newClient(Config.getCreds())
    client.setGatewayHost(Config.getGatewayHost())
    client.setTestGatewayHost(Config.getTestGatewayHost())
    let request = {
      terminalName: Config.getTerminalName(),
      test: true,
      transaction: {
        "items": [
          {
            "id": "test-item-1",
            "description": "Quality Nachos",
            "price": "3.50",
            "quantity": 1,
            "extended": "2.50",
            "discounts": [
              {
              "description": "Enjoyment Vector Discount",
              "amount": "1.00"
              }
            ]
          }
        ],
        "subtotal": "19.00",
        "tax": "1.50",
        "total": "10.50"
      }
    }

    client.updateTransactionDisplay(request)
    .then(function (response) {
      let msgResponse = response.data
      console.log("TEST RESPONSE" + JSON.stringify(msgResponse))
      expect(msgResponse.success).toBe(true);
      done()
    })
    .catch(function (error) {
      console.log("Error:", error)
      done()
    })

  });


});
