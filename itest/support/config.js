fs = require('fs')

var ITestConfig = {

  load: function () {
    //TODO this needs to move to the ~./.config/blockchyp/sdk-itest-config.json convention
    var data = fs.readFileSync('/etc/blockchyp/sdk-itest-config.json');
    ITestConfig.config = JSON.parse(data)

  },

  getTerminalAddress: function () {
    return ITestConfig.config.defaultTerminalAddress
  },

  getTerminalName: function () {
    return ITestConfig.config.defaultTerminalName
  },

  getGatewayHost: function () {
    return ITestConfig.config.gatewayHost
  },

  getApiKey: function () {
    return ITestConfig.config.apiKey
  },

  getBearerToken: function () {
    return ITestConfig.config.bearerToken
  },

  getSigningKey: function () {
    return ITestConfig.config.signingKey
  },

  getCreds: function () {
    return {apiKey: ITestConfig.config.apiKey, bearerToken: ITestConfig.config.bearerToken, signingKey: ITestConfig.config.signingKey}
  }

};

module.exports = {

  config: ITestConfig

}
