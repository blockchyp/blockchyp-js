let BlockChyp = require('@blockchyp/blockchyp-js');


let client = BlockChyp.newClient({
  apiKey: 'ZDSMMZLGRPBPRTJUBTAFBYZ33Q',
  bearerToken: 'ZLBW5NR4U5PKD5PNP3ZP3OZS5U',
  signingKey: '9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947'
});

client.termsAndConditions({
  test: true,
  terminalName: 'Test Terminal',

  // Alias for a Terms and Conditions template configured in the BlockChyp
  // dashboard.
  tcAlias: 'hippa',

  // Name of the contract or document if not using an alias.
  tcName: 'HIPPA Disclosure',

  // Full text of the contract or disclosure if not using an alias.
  tcContent: 'Full contract text',

  // File format for the signature image.
  sigFormat: BlockChyp.SignatureFormat.PNG,

  // Width of the signature image in pixels.
  sigWidth: 200,

  // Whether or not a signature is required. Defaults to true.
  sigRequired: true,
})
.then(function (response) {
    console.log('Response: ' + JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error)
  });
