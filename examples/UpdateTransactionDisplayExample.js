let BlockChyp = require('@blockchyp/blockchyp-js');

let client = BlockChyp.newClient({
  apiKey: 'ZDSMMZLGRPBPRTJUBTAFBYZ33Q',
  bearerToken: 'ZLBW5NR4U5PKD5PNP3ZP3OZS5U',
  signingKey: '9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947'
});

client.updateTransactionDisplay({
  test: true,
  terminalName: 'Test Terminal',
  transaction: {
    subtotal: '60.00',
    tax: '5.00',
    total: '65.00',
    items: [
      {
        description: 'Leki Trekking Poles',
        price: '35.00',
        quantity: 2,
        extended: '70.00',
        discounts: [
          {
            description: 'memberDiscount',
            amount: '10.00',
          },
        ],
      },
    ],
  },
})
  .then(function (response) {
    console.log('Response: ' + JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error)
  });
