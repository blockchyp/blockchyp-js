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

      // Type of prompt. Can be 'email', 'phone', 'customer-number', or
      // 'rewards-number'.
      promptType: PromptType.EMAIL,
  }

  response = client.textPrompt(request)


  //process the result
  if (response.success) {
    console.log("Success");
  }

  console.log(response.response);

