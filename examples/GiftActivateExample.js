  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
      amount: "50.00",
  }

  response = client.giftActivate(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }

  console.log(response.amount);
  console.log(response.currentBalance);
  console.log(response.publicKey);

