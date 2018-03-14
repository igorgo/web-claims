const rest = require('../rest')
const db = require('../db')

const logonHandler = async (req, res, next) => {
  const {user, pass} = req.params
  let result
  try {
    result = await db.logon(user, pass)
    res.send(200, result)
  } catch (e) {
    return next(new rest.errors.UnauthorizedError(e.message))
  }
}

const logoffHandler = async (req, res) => {
  const {sessionID} = req.params
  try {
    await db.logoff(sessionID)
    res.send(200, 'OK')
  } catch (e) {
    res.send(200, 'OK')
  }
}

rest.post('/logon', logonHandler)
rest.post('/logoff', logoffHandler)
