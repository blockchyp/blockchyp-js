  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      terminalName: "Test Terminal",
      transactionId: "<PREVIOUS TRANSACTION ID>",

      // Optional amount for partial refunds.
      amount: "5.00",
  }

  response = client.refund(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }


