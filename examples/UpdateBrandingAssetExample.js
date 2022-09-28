let BlockChyp = require('@blockchyp/blockchyp-js');


let client = BlockChyp.newClient({
  apiKey: 'ZDSMMZLGRPBPRTJUBTAFBYZ33Q',
  bearerToken: 'ZLBW5NR4U5PKD5PNP3ZP3OZS5U',
  signingKey: '9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947'
});

client.updateBrandingAsset({
  mediaId: '<MEDIA ID>',
  padded: true,
  ordinal: 10,
  startDate: '01/06/2021',
  startTime: '14:00',
  endDate: '11/05/2024',
  endTime: '16:00',
  notes: 'Test Branding Asset',
  preview: false,
  enabled: true,
})
.then(function (response) {
    console.log('Response: ' + JSON.stringify(response.data))
  })
  .catch(function (error) {
    console.log(error)
  });
