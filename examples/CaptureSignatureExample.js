let BlockChyp = require('@blockchyp/blockchyp-js');

let client = BlockChyp.newClient({
  apiKey: 'ZDSMMZLGRPBPRTJUBTAFBYZ33Q',
  bearerToken: 'ZLBW5NR4U5PKD5PNP3ZP3OZS5U',
  signingKey: '9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947'
});

client.captureSignature({
  terminalName: 'Test Terminal',

  // File format for the signature image.
  sigFormat: BlockChyp.SignatureFormat.PNG,

  // Width of the signature image in pixels.
  sigWidth: 200,
})
  .then(function (response) {
    console.log('Response: ' + JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error)
  });
