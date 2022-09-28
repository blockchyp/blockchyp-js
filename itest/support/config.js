fs = require('fs')

var ITestConfig = {

  load: function () {
    var isWindows = require('is-windows')
    var configHome = ''
    if (isWindows()) {
      configHome = process.env.userprofile
    } else {
      configHome = process.env.XDG_CONFIG_HOME
      if (!configHome) {
        configHome = require('path').join(require('os').homedir(), '/.config')
      }
    }

    var fileLocation = require('path').join(configHome, 'blockchyp', 'sdk-itest-config.json')
    var data = fs.readFileSync(fileLocation)
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

  getDashboardHost: function () {
    return ITestConfig.config.dashboardHost
  },

  getTestGatewayHost: function () {
    return ITestConfig.config.testGatewayHost
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

  getCreds: function (profile) {
    if (profile) {
      return ITestConfig.config.profiles[profile]
    }
    return {apiKey: ITestConfig.config.apiKey, bearerToken: ITestConfig.config.bearerToken, signingKey: ITestConfig.config.signingKey}
  }

};

module.exports = {

  config: ITestConfig

}
