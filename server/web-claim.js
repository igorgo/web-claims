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

async function shutdown (code) {
  const msg = code === 2 ? 'Unexpected error occured.' : 'Shutdown (SIGTERM/SIGINT) Initialised.'
  console.log(msg)
  try {
    await require('./src/db').close()
    console.log('Database connection closed.')
  } catch (e) {
    console.error(e)
  }
  console.log('Shutdown complete.')
  process.exit(code)
}

async function runServer () {
  await loadConfig()
  const db = require('./src/db')
  await db.open()
  void require('./src/rest').start()
}

process.on('SIGTERM', async () => {
  await shutdown(0)
})
process.on('SIGINT', async () => {
  await shutdown(0)
})
process.on('SIGHUP', async () => {
  await shutdown(0)
})

process.on('uncaughtException', async err => {
  await shutdown(2)
})
process.on('unhandledRejection', async err => {
  await shutdown(2)
})

void runServer()
