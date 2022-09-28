let BlockChyp = require('@blockchyp/blockchyp-js');


let client = BlockChyp.newClient({
  apiKey: 'ZDSMMZLGRPBPRTJUBTAFBYZ33Q',
  bearerToken: 'ZLBW5NR4U5PKD5PNP3ZP3OZS5U',
  signingKey: '9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947'
});

client.textPrompt({
  test: true,
  terminalName: 'Test Terminal',

  // Type of prompt. Can be 'email', 'phone', 'customer-number', or
  // 'rewards-number'.
  promptType: BlockChyp.PromptType.EMAIL,
})
.then(function (response) {
    console.log('Response: ' + JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error)
  });
