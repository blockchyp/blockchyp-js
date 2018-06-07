describe("Crypto", function() {
  var Crypto = require('../dist/crypto.js').default;

  console.log(Crypto)

  it("Should Exist", function() {
    expect(Crypto).toBeDefined();
  });


  it("Should Generate Valid Headers", function() {
    let creds = {
      apiId: "SGLATIFZD7PIMLAQJ2744MOEGI",
      bearerToken: "FI2SWNNJHJVO6DBZEF26YEHHMY",
      signingKey: "LWTT5JUP2L4GCFWOIKPTDQMFFNZYXKDAA25VZGJDD2A7E7EVP5YA===="
    }

    headers = Crypto.generateGatewayHeaders(creds)
    console.log(headers)
    expect(headers).toBeDefined();
  });

});
