const rest = require('../rest')
const db = require('../db')
const { checkSession } = require('./checkAuth')

async function getClaimStatuses (req, res, next) {
  try {
    checkSession(req)
    const { sessionID } = req.params
    const result = await db.execute(sessionID, 'select S01 as "code" from table(UDO_PACKAGE_NODEWEB_IFACE.GET_ALL_STATUSES)')
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getAppList (req, res, next) {
  try {
    checkSession(req)
    const { sessionID } = req.params
    const result = await db.execute(sessionID, 'select S01 as "app" from table(UDO_PACKAGE_NODEWEB_IFACE.GET_ALL_APPS)')
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getUnitList (req, res, next) {
  try {
    checkSession(req)
    const { sessionID } = req.params
    const result = await db.execute(sessionID, 'select S01 as "unit" from table(UDO_PACKAGE_NODEWEB_IFACE.GET_ALL_UNITS)')
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.get('/dicts/claim-statuses', getClaimStatuses)
rest.get('/dicts/app-list', getAppList)
rest.get('/dicts/unit-list', getUnitList)