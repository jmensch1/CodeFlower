require('module-alias/register')

const config = require('@config')
const Log = require('@log')
const HTTP = require('./protocols/HTTP')
const WS = require('./protocols/WS')
const setHostName = require('./util/setHostName')
const endpoints = require('./api/endpoints')
const handleErrors = require('./api/handleErrors')

/////////// A PROTOCOL-AGNOSTIC SERVER ////////////

async function serve(protocol, request, response) {
  const { parseRequest, Responder } = protocol
  const { onSuccess, onError, onUpdate } = Responder(response)

  try {
    const { endpoint, params } = parseRequest(request)

    const handler = endpoints[endpoint]
    if (!handler)
      throw {
        ...config.errors.EndpointNotRecognized,
        endpoint,
      }

    const data = await handler(params, onUpdate)
    onSuccess(data)
  } catch (error) {
    handleErrors(error, onError)
  }
}

////////////////////// MAIN ////////////////////////

// create http and ws servers
const httpServer = HTTP.createServer(serve.bind(null, HTTP))
WS.createServer(serve.bind(null, WS), httpServer)

// start listening
const port = config.ports.HTTP
httpServer.listen(port, () => {
  Log(1, `WS and HTTP servers started on port ${port}...`)
  setHostName()
})
