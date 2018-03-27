const rest = require('../rest')
const db = require('../db')
const { checkSession } = require('./checkAuth')

async function getAllUserData (req, res, next) {
  try {
    checkSession(req)
    const { sessionID } = req.params
    const result = await db.execute(sessionID, `
      select S02 as "name",
             S01 as "str",
             N01 as "num",
             D01 as "dat"
        from table(UDO_PACKAGE_NODEWEB_IFACE.GET_USERDATA)
    `)
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.get('/userdata', getAllUserData)
