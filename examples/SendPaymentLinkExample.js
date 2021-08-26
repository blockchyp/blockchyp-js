let BlockChyp = require('@blockchyp/blockchyp-js');

let client = BlockChyp.newClient({
  apiKey: 'ZDSMMZLGRPBPRTJUBTAFBYZ33Q',
  bearerToken: 'ZLBW5NR4U5PKD5PNP3ZP3OZS5U',
  signingKey: '9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947'
});

client.sendPaymentLink({
  amount: '199.99',
  description: 'Widget',
  subject: 'Widget invoice',
  transaction: {
    subtotal: '195.00',
    tax: '4.99',
    total: '199.99',
    items: [
      {
        description: 'Widget',
        price: '195.00',
        quantity: 1,
      },
    ],
  },
  autoSend: true,
  customer: {
    customerRef: 'Customer reference string',
    firstName: 'FirstName',
    lastName: 'LastName',
    companyName: 'Company Name',
    emailAddress: 'support@blockchyp.com',
    smsNumber: '(123) 123-1231',
  },
})
  .then(function (response) {
    console.log('Response: ' + JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error)
  });
