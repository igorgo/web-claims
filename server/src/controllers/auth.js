const rest = require('../rest')
const db = require('../db')

async function logonHandler (req, res, next) {
  const {user, pass} = req.params
  let result
  try {
    result = await db.logon(user, pass)
    res.send(200, result)
  } catch (e) {
    return next(new rest.errors.UnauthorizedError(e.message))
  }
}

async function logoffHandler (req, res) {
  const {sessionID} = req.params
  try {
    await db.logoff(sessionID)
    res.send(200, 'OK')
  } catch (e) {
    res.send(200, 'OK')
  }
}

async function validateHandler (req, res, next) {
  const {sessionID} = req.params
  try {
    const conn = await db.getConnection(sessionID)
    conn.close()
    res.send(200, 'OK')
  } catch (e) {
    return next(new rest.errors.UnauthorizedError(e.message))
  }
}

rest.post('/auth/logon', logonHandler)
rest.post('/auth/logoff', logoffHandler)
rest.post('/auth/validate', validateHandler)
