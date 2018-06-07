describe("Crypto", function() {
  var Crypto = require('../dist/cryptoutils.js').default;

  console.log(Crypto)

  it("Should Exist", function() {
    expect(Crypto).toBeDefined();
  });


  it("Should Generate Valid Headers", function() {
    let creds = {
      apiId: "SGLATIFZD7PIMLAQJ2744MOEGI",
      bearerToken: "FI2SWNNJHJVO6DBZEF26YEHHMY",
      signingKey: "c3a8214c318dd470b0107d6c111f086b60ad695aaeb598bf7d1032eee95339a0"
    }
    headers = Crypto.generateGatewayHeaders(creds)
    expect(headers).toBeDefined();
  });

  it("Should Support RSA Encryption", function() {
    let keys = Crypto.generateRsaKeys()
    expect(keys).toBeDefined();

    let plainText = 'The quick brown fox jumped over the lazy dog.'
    let cipherText = Crypto.encryptRsa(keys.publicKey, plainText)
    console.log("Cipher Text: ", cipherText)
    expect(cipherText).toBeDefined();

    let decryptedCipherText = Crypto.decryptRsa(keys.privateKey, cipherText)
    expect(decryptedCipherText).toBe(plainText)

  });

});
