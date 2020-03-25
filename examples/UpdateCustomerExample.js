  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      customer:   {
      id: 'ID of the customer to update',
      customerRef: 'Customer reference string',
      firstName: 'FirstName',
      lastName: 'LastName',
      companyName: 'Company Name',
      emailAddress: 'support@blockchyp.com',
      smsNumber: '(123) 123-1231',
  },
  }

  response = client.updateCustomer(request)


  // view the result
  console.log("Response: " + JSON.stringify(response))
