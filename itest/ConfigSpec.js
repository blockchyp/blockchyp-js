describe("IntegrationTestConfig", function() {
  var Config = require('../itest/support/config').config;
  Config.load();

  it("Should Exist", function() {
    expect(Config).toBeDefined();
  });

  it("Has Terminal IP Address", function() {
    expect(Config.getTerminalAddress()).toBeDefined();
  });

  it("Has Terminal Name", function() {
    expect(Config.getTerminalName()).toBeDefined();
  });

  it("Has Gateway Host", function() {
    expect(Config.getGatewayHost()).toBeDefined();
  });

  it("Has API ID", function() {
    expect(Config.getApiId()).toBeDefined();
  });

  it("Has Bearer Token", function() {
    expect(Config.getBearerToken()).toBeDefined();
  });

  it("Has Signing Key", function() {
    expect(Config.getSigningKey()).toBeDefined();
  });

  it("Has Credentials", function() {
    var creds = Config.getCreds();
    expect(creds.apiId).toBeDefined();
    expect(creds.bearerToken).toBeDefined();
    expect(creds.signingKey).toBeDefined();
  });

});
