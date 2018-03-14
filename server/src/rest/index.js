const restify = require('restify')
const errors = require('restify-errors')
const nconf = require('nconf')
const path = require('path')

const rest = module.exports

function apiRoute (route) {
  return '/api' + route
}

let restStarted = false
let restServer

rest.active = () => restStarted

rest.errors = errors

rest.start = async () => {
  if (restStarted) return
  restServer = restify.createServer({ name: 'Afina Server' })
  restServer.use(restify.plugins.bodyParser({ mapParams: true }))
  restServer.use(restify.plugins.queryParser({ mapParams: true }))
  require('../controllers')
  // require('./restEntriesMock')
  restServer.get(/\/.*/, restify.plugins.serveStatic({
    directory: path.resolve(__dirname, '../../static'),
    default: 'index.html'
  }))
  restServer.on('restifyError', function (req, res, err, callback) {
    err.toJSON = () => ({ name: err.name, message: err.message })
    err.toString = () => (err.name + '.' + err.message)
    return callback()
  })
  restServer.listen(nconf.get('rest:port'), nconf.get('rest:host'), () => {})
  restStarted = true
}

rest.get = (aRoute, aHandler) => {
  restServer.get(apiRoute(aRoute), aHandler)
}

rest.post = (aRoute, aHandler) => {
  restServer.post(apiRoute(aRoute), aHandler)
}

rest.put = (aRoute, aHandler) => {
  restServer.put(apiRoute(aRoute), aHandler)
}

rest.head = (aRoute, aHandler) => {
  restServer.head(apiRoute(aRoute), aHandler)
}

rest.delete = (aRoute, aHandler) => {
  restServer.del(apiRoute(aRoute), aHandler)
}

rest.internalError = (next, err) => {
  next(new errors.InternalServerError((err instanceof Error) ? err.message : err))
}

rest.accessError = (next, err) => {
  next(new errors.ForbiddenError((err instanceof Error) ? err.message : err))
}

rest.actionNotFound = (next, action, endPoint) => {
  next(new errors.NotFoundError(`Action «${action}» not defined for endpoint «${endPoint}»`))
}
