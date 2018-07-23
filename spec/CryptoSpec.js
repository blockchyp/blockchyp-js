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


    console.log('AES KEY: ' + shared1)

    let plainText = 'The quick brown fox jumped over the lazy dog'

    let cipherText = Crypto.encrypt(shared1, plainText)

    console.log('Cipher Text: ' + cipherText)

    let plainTextDecrypted = Crypto.decrypt(shared1, cipherText)

    expect(plainTextDecrypted).toBe(plainText)


  });

  it("Should Decrypt Go Encoded AES", function () {
    let goCipher = '14b4e146a46ca9581d0900590b5d4bb9b945e7d3574834d239e9a695bc4ad5a7a7d05bc0e677f34cb8f125844b82a58c40ce2d1b07d44efe5a87a2dfc9cdd6d4'
    let key = '7ef938ebbd24808f800bb368a4b97ba7'

    let expectedPlainText = 'The quick brown fox jumped over the lazy dog.'

    let plainText = Crypto.decrypt(key, goCipher)

    expect(plainText).toBe(expectedPlainText)

  });


  it("Should Compute SHA 256 Hashes", function () {
    let msg = 'f181167e704a9d06d66a2299b67882da7133d120c789e57d44041fa2a84ccad805a9f64788a905ac8734b990552c19070e18c09363b832680594b9aaa1dfc987179225d3cea9c8086aeaa04b3f72eb9fcf674dc6efd7ce158628b274677f0164beaf9eb0f54283b3fb7e592118db27069e231d1e4a3a500784ed123931db8240b7bbb99618b78348491bebe370b7850c459fb5390fb126b58c2212729d1e35c99880ca68e066949f03e6e56e261d15892828eddf250120e336a3580b5158ab32f5415bfce9ebeec70ef1e7bc8f50eec349d2175b9ec7dc4b6dfdc2201f4a55edf8becb860419871732c994e829caf7793ed695ca094a9154cb343659269addcf'

    let expectedHash = 'f04e71b08dd61a4b9b88e695f09e4688b1d54dd0930450b52444bcd961b6ec6d'

    let hash = Crypto.sha256Hash(msg)

    expect(hash).toBe(expectedHash)

  });


  it("Should Validate ECDSA Signatures", function () {

    let msg = 'f181167e704a9d06d66a2299b67882da7133d120c789e57d44041fa2a84ccad805a9f64788a905ac8734b990552c19070e18c09363b832680594b9aaa1dfc987179225d3cea9c8086aeaa04b3f72eb9fcf674dc6efd7ce158628b274677f0164beaf9eb0f54283b3fb7e592118db27069e231d1e4a3a500784ed123931db8240b7bbb99618b78348491bebe370b7850c459fb5390fb126b58c2212729d1e35c99880ca68e066949f03e6e56e261d15892828eddf250120e336a3580b5158ab32f5415bfce9ebeec70ef1e7bc8f50eec349d2175b9ec7dc4b6dfdc2201f4a55edf8becb860419871732c994e829caf7793ed695ca094a9154cb343659269addcf'
    let expectedHash = 'f04e71b08dd61a4b9b88e695f09e4688b1d54dd0930450b52444bcd961b6ec6d'
    let publicKey = {curve: 'P256', x: '19df5428dd9910f6ab782f93f7f6510c3586b388645a4c32949648808a942a6a', y: '9271bc89d32269918a9dcadc7a9d1f9fb74c8694526457256216cf004bef75b5'}
    let sig =   {curve: 'P256', r: 'd87c63c63d91dd0a316c93a78a758ff38079082d7b57122bc6885ddff13ac641', s: '5f2e0ff997ffa5508bcf4168c0ae61e453a8a93c54e9b2634c2f4fedd7e64cca'}

    let valid = Crypto.validateSignature(publicKey, msg, sig)

    expect(valid).toBe(true)

  });




});
