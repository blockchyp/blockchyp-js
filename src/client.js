let axios = require('axios')
class BlockChypClient {
  constructor () {
    this.host = 'https://api.blockchyp.com'
    this.defaultCreds = {}
    this._routeCache = {}
  }

  getHost () {
    return this.host
  }

  setHost (host) {
    this.host = host
  }

  heartbeat (creds) {
    return this._get('/api/heartbeat', creds)
  }

  test (terminalName, creds) {
    this._get('/api/route?term=' + terminalName, creds)
  }

  _get (path, creds) {
    let url = this.host + path
    console.log('GET: ' + url)
    return axios.get(url)
  }
}

export class BlockChypCredentials {
  constructor (apiId, bearerToken, signingKey) {
    this.apiId = apiId
    this.bearerToken = bearerToken
    this.signingKey = signingKey
  }
}

var BlockChyp = new BlockChypClient()
export default BlockChyp
