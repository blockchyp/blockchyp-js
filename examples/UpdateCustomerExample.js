let BlockChyp = require('@blockchyp/blockchyp-js');


let client = BlockChyp.newClient({
  apiKey: 'ZDSMMZLGRPBPRTJUBTAFBYZ33Q',
  bearerToken: 'ZLBW5NR4U5PKD5PNP3ZP3OZS5U',
  signingKey: '9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947'
});

client.updateCustomer({
  customer: {
    id: '<CUSTOMER ID>',
    customerRef: 'Customer reference string',
    firstName: 'FirstName',
    lastName: 'LastName',
    companyName: 'Company Name',
    emailAddress: 'notifications@blockchypteam.m8r.co',
    smsNumber: '(123) 123-1231',
  },
})
.then(function (response) {
    console.log('Response: ' + JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error)
  });
