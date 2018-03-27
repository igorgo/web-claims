const rest = require('../rest')
const db = require('../db')
const { checkSession } = require('./checkAuth')

async function claimsFind (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, conditionId = null, sortOrder = null, page = 1, limit = 25, newClaimId = null } = req.params
    const params = db.createParams()
    params.add('A_COND').dirIn().typeNumber().val(conditionId)
    params.add('A_SORT').dirIn().typeString().val(sortOrder)
    params.add('A_OFFSET').dirIn().typeNumber().val(page - 1)
    params.add('A_LIMIT').dirIn().typeNumber().val(limit)
    params.add('A_NEW_RN').dirIn().typeNumber().val(newClaimId)
    const conn = await db.getConnection(sessionID)
    try {
      const result = await db.execute(sessionID, `
      select N01 as "id",
             N02 as "claimType",
             N03 as "hasReleaseTo",
             N04 as "typicalStatus",
             N05 as "priority",
             N06 as "hasDocs",
             N08 as "executorType",
             N07 as "hasBuildTo",
             N10 as "allCnt",
             S01 as "numb",
             S02 as "closedInBuild",
             S04 as "unit",
             S05 as "apps",
             S06 as "status",
             S07 as "author",
             S08 as "description",
             S09 as "executor",
             D01 as "regDate",
             D02 as "changeDate"
        from table(UDO_PACKAGE_NODEWEB_IFACE.GET_CLAIMS(
          :A_COND,
          :A_SORT,
          :A_OFFSET,
          :A_LIMIT,
          :A_NEW_RN
         ))`, params, {}, conn)
      const response = {}
      let allCnt = 0
      const rows = result.rows
      if (rows) {
        response.claims = rows.map(rec => {
          let record
          ({ allCnt, ...record } = rec)
          return record
        })
        response.allCnt = allCnt
        response.page = page
        response.limit = limit
      }
      await db.execute(sessionID, 'begin UDO_PACKAGE_NODEWEB_IFACE.CLEAR_CONDS; end;', [], {}, conn)
      res.send(200, response)
    } finally {
      conn.close()
    }
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.post('/claims/find', claimsFind)