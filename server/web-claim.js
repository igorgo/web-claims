const path = require('path')
const fs = require('fs')
const nconf = require('nconf')

const configFile = path.join(__dirname, 'config', 'config.json')
const configExists = fs.existsSync(configFile)
const pkg = require('./package.json')

async function loadConfig () {
  if (!configExists) {
    process.stdout.write('\nConfig file does not exist. First you must run\n\tnode setup\n')
    process.exit(-1)
  }
  nconf.argv().env({
    separator: '__',
    lowerCase: true
  })
  nconf.file({
    file: configFile
  })
  nconf.defaults({
    baseDir: __dirname,
    version: pkg.version
  })
}

async function runServer () {
  await loadConfig()
  const db = require('./src/db/db')
  await db.open()
  void require('./src/rest/restServer').start()
}

void runServer()
