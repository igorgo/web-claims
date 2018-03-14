const DbDriver = require('./AfinaSequelDb')
const nconf = require('nconf')

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
    module: nconf.get('db:module'),
    pubUser: nconf.get('public:username'),
    pubPassword: nconf.get('public:password')
  }
)

module.exports = db
