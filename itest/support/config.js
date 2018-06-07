fs = require('fs')

var ITestConfig = {

  load: function () {

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

  getApiId: function () {
    return ITestConfig.config.apiId
  },

  getBearerToken: function () {
    return ITestConfig.config.bearerToken
  },

  getSigningKey: function () {
    return ITestConfig.config.signingKey
  },

  getCreds: function () {
    return {apiId: ITestConfig.config.apiId, bearerToken: ITestConfig.config.bearerToken, signingKey: ITestConfig.config.signingKey}
  }

};

module.exports = {

  config: ITestConfig

}
