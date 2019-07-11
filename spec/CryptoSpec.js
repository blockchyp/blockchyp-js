describe("Crypto", function() {
  var Crypto = require('../dist/cryptoutils.js').default;

  console.log(Crypto)


  it("Should Exist", function() {
    expect(Crypto).toBeDefined();
  });

  it("Should Generate Valid Headers", function() {
    let creds = {
      apiKey: "SGLATIFZD7PIMLAQJ2744MOEGI",
      bearerToken: "FI2SWNNJHJVO6DBZEF26YEHHMY",
      signingKey: "c3a8214c318dd470b0107d6c111f086b60ad695aaeb598bf7d1032eee95339a0"
    }
    headers = Crypto.generateGatewayHeaders(creds)
    console.log(JSON.stringify(headers))
    expect(headers).toBeDefined();
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

});
