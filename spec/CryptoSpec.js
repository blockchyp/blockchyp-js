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
    console.log(JSON.stringify(headers))
    expect(headers).toBeDefined();
  });

  it("Should Derive Diffie Hellman Key", function() {
    let key1 = Crypto.generateDiffieHellmanKeys()
    let key2 = Crypto.generateDiffieHellmanKeys()
    console.log("Key 1: " + JSON.stringify(key1))
    expect(key1.privateKey).toBeDefined()
    expect(key1.publicKey).toBeDefined()
    console.log("Key 2: " + JSON.stringify(key2))
    expect(key2.privateKey).toBeDefined()
    expect(key2.publicKey).toBeDefined()
    let shared1 = Crypto.computeSharedKey(key1.privateKey, key2.publicKey)
    let shared2 = Crypto.computeSharedKey(key2.privateKey, key1.publicKey)
    console.log("Shared 1: " + shared1)
    console.log("Shared 2: " + shared2)
    expect(shared1).toBe(shared2)

  });

});
