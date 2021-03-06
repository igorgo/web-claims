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

async function getBuilds (req, res, next) {
  try {
    checkSession(req)
    const { sessionID } = req.params
    const result = await db.execute(sessionID, `
      select 
        S01 as "v",
        S02 as "r",
        S03 as "b",
        D01 as "d"
      from table(UDO_PACKAGE_NODEWEB_IFACE.GET_ALL_BUILDS)`)
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getPersons (req, res, next) {
  try {
    checkSession(req)
    const { sessionID } = req.params
    const result = await db.execute(sessionID, `
      select 
        S01 as "l",
        S02 as "v"
      from table(UDO_PACKAGE_NODEWEB_IFACE.GET_ALL_PERSON)`)
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getAppsByUnits (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, unit } = req.params
    const params = db.createParams()
    params.add('UNITS').dirIn().typeString().val(unit)
    const result = await db.execute(sessionID, `
      select
        S01 as "appName"
      from table(UDO_PACKAGE_NODEWEB_IFACE.GET_APPS_BY_UNIT(:UNITS))`, params)
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getFuncByUnits (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, unit } = req.params
    const params = db.createParams()
    params.add('UNIT').dirIn().typeString().val(unit)
    const result = await db.execute(sessionID, `
      select
        S01 as "funcName"
      from table(UDO_PACKAGE_NODEWEB_IFACE.GET_FUNCS_BY_UNIT(:UNIT))`, params)
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.get('/dicts/claim-statuses', getClaimStatuses)
rest.get('/dicts/app-list', getAppList)
rest.get('/dicts/unit-list', getUnitList)
rest.get('/dicts/build-list', getBuilds)
rest.get('/dicts/person-list', getPersons)
rest.get('/dicts/apps-by-unit', getAppsByUnits)
rest.get('/dicts/func-by-unit', getFuncByUnits)
