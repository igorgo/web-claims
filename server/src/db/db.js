const DbDriver = require('./AfinaSequelDb')
const nconf = require('nconf')
const duration = require('go-duration')

let pubSessionActive = false
let pubSessionID
let pubSessionTimer

const pubKeepAlive = () => {
  if (!db.pubSessionActive) return
  db.getConnectionPub().then((c) => {
    c.close()
  })
}

const db = new DbDriver(
  {
    host: nconf.get('db:host'),
    port: nconf.get('db:port'),
    database: nconf.get('db:database'),
    schema: nconf.get('db:schema'),
    username: nconf.get('db:username'),
    password: nconf.get('db:password'),
    oldPkgSess: nconf.get('db:oldpkgsess'),
    scompany: nconf.get('db:scompany'),
    module: nconf.get('db:module')
  }
)

db['pubLogon'] = async () => {
  pubSessionActive = false
  if (!nconf.get('app:public')) return
  const cLogInfo = await db.logon(nconf.get('public:username'), nconf.get('public:password'))
  pubSessionID = cLogInfo.sessionID
  pubSessionActive = true
  pubSessionTimer = setInterval(
    pubKeepAlive,
    duration('30m')
  )
}

db['getConnectionPub'] = async () => db.getConnection(pubSessionID)

module.exports = db
