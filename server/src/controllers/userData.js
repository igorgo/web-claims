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

async function setUserData (req, res, next) {
  try {
    checkSession(req)
    const {sessionID, key, type, value} = req.params
    const lSQL = `
begin
  UDO_PACKAGE_NODEWEB_IFACE.SET_USERDATA(A_PARAM_NAME => :A_PARAM_NAME,
                                         A_VALUE_NUM  => :A_VALUE_NUM,
                                         A_VALUE_STR  => :A_VALUE_STR,
                                         A_VALUE_DATE => :A_VALUE_DATE);
end;
  `
    const params = db.createParams()
    params.add('A_PARAM_NAME').dirIn().typeString().val(key)
    params.add('A_VALUE_NUM').dirIn().typeNumber().val(type === 'N' ? value : null)
    params.add('A_VALUE_STR').dirIn().typeString().val(type === 'S' ? value : null)
    params.add('A_VALUE_DATE').dirIn().typeDate().val(type === 'D' ? value : null)
    await db.execute(sessionID, lSQL, params)
    res.status(204)
    res.end()
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.get('/userdata', getAllUserData)
rest.post('/userdata', setUserData)
