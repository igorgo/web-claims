const rest = require('../rest')
const db = require('../db')
const { checkSession } = require('./checkAuth')

async function getClaimConditionsList (req, res, next) {
  try {
    checkSession(req)
    const { sessionID } = req.params
    const result = await db.execute(sessionID, 'select N01 "rn", S01 "name", S02 "editable" from table(UDO_PACKAGE_NODEWEB_IFACE.GET_CONDITIONS_LIST)')
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getClaimConditionOne (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, rn } = req.params
    const nrn = rn ? parseInt(rn) : null
    const sql = `
      begin
        UDO_PACKAGE_NODEWEB_IFACE.GET_CONDITION(
          P_RN             => :P_RN,
          P_FILTER_NAME    => :P_FILTER_NAME,
          P_CLAIM_NUMB     => :P_CLAIM_NUMB,
          P_CLAIM_TYPE     => :P_CLAIM_TYPE,
          P_CLAIM_STATUS   => :P_CLAIM_STATUS,
          P_CLAIM_VERS     => :P_CLAIM_VERS,
          P_CLAIM_RELEASE  => :P_CLAIM_RELEASE,
          P_CLAIM_BUILD    => :P_CLAIM_BUILD,
          P_CLAIM_UNIT     => :P_CLAIM_UNIT,
          P_CLAIM_APP      => :P_CLAIM_APP,
          P_CLAIM_AUTHOR   => :P_CLAIM_AUTHOR,
          P_CLAIM_IM_INIT  => :P_CLAIM_IM_INIT,
          P_CLAIM_EXEC     => :P_CLAIM_EXEC,
          P_CLAIM_IM_PERF  => :P_CLAIM_IM_PERF,
          P_CLAIM_CONTENT  => :P_CLAIM_CONTENT,
          P_CLAIM_HELPSIGN => :P_CLAIM_HELPSIGN
        );
      end;
   `
    const params = db.createParams()
    params.add('P_RN').dirInOut().typeNumber().val(nrn)
    params.add('P_FILTER_NAME').dirOut().typeString(1000)
    params.add('P_CLAIM_NUMB').dirOut().typeString(1000)
    params.add('P_CLAIM_TYPE').dirOut().typeString(1000)
    params.add('P_CLAIM_STATUS').dirOut().typeString(4000)
    params.add('P_CLAIM_VERS').dirOut().typeString(1000)
    params.add('P_CLAIM_RELEASE').dirOut().typeString(1000)
    params.add('P_CLAIM_BUILD').dirOut().typeString(1000)
    params.add('P_CLAIM_UNIT').dirOut().typeString(1000)
    params.add('P_CLAIM_APP').dirOut().typeString(1000)
    params.add('P_CLAIM_AUTHOR').dirOut().typeString(1000)
    params.add('P_CLAIM_IM_INIT').dirOut().typeNumber()
    params.add('P_CLAIM_EXEC').dirOut().typeString(1000)
    params.add('P_CLAIM_IM_PERF').dirOut().typeNumber()
    params.add('P_CLAIM_CONTENT').dirOut().typeString(1000)
    params.add('P_CLAIM_HELPSIGN').dirOut().typeString(1000)
    const result = (await db.execute(sessionID, sql, params)).outBinds
    res.send(200, {
      rn: nrn,
      name: result['P_FILTER_NAME'],
      claimNumb: result['P_CLAIM_NUMB'],
      claimVersion: result['P_CLAIM_VERS'],
      claimRelease: result['P_CLAIM_RELEASE'],
      claimBuild: result['P_CLAIM_BUILD'],
      claimUnit: result['P_CLAIM_UNIT'],
      claimApp: result['P_CLAIM_APP'],
      imInitiator: result['P_CLAIM_IM_INIT'] ? 1 : 0,
      imExecutor: result['P_CLAIM_IM_PERF'] ? 1 : 0,
      claimContent: result['P_CLAIM_CONTENT'],
      claimStatus: result['P_CLAIM_STATUS'],
      claimExecutor: result['P_CLAIM_EXEC'],
      claimAuthor: result['P_CLAIM_AUTHOR'],
      claimType: result['P_CLAIM_TYPE'],
      helpSign: result['P_CLAIM_HELPSIGN']
    })
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function deleteClaimCondition (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, rn } = req.params
    const sql =
      `begin
        UDO_PACKAGE_NODEWEB_IFACE.DELETE_FILTER(
          P_FILTER_RN => :P_FILTER_RN
        );
      end;`
    const params = db.createParams()
    params.add('P_FILTER_RN').dirIn().typeNumber().val(rn)
    await db.execute(sessionID, sql, params)
    res.send(200)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function saveClaimCondition (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, filter } = req.params
    const sql = `begin
    UDO_PACKAGE_NODEWEB_IFACE.STORE_FILTER(
      P_FILTER_RN      => :P_FILTER_RN,
      P_FILTER_NAME    => :P_FILTER_NAME,
      P_CLAIM_NUMB     => :P_CLAIM_NUMB,
      P_CLAIM_TYPE     => :P_CLAIM_TYPE,
      P_CLAIM_STATUS   => :P_CLAIM_STATUS,
      P_CLAIM_VERS     => :P_CLAIM_VERS,
      P_CLAIM_RELEASE  => :P_CLAIM_RELEASE,
      P_CLAIM_BUILD    => :P_CLAIM_BUILD,
      P_CLAIM_UNIT     => :P_CLAIM_UNIT,
      P_CLAIM_APP      => :P_CLAIM_APP,
      P_CLAIM_AUTHOR   => :P_CLAIM_AUTHOR,
      P_CLAIM_IM_INIT  => :P_CLAIM_IM_INIT,
      P_CLAIM_EXEC     => :P_CLAIM_EXEC,
      P_CLAIM_IM_PERF  => :P_CLAIM_IM_PERF,
      P_CLAIM_CONTENT  => :P_CLAIM_CONTENT,
      P_CLAIM_HELPSIGN => :P_CLAIM_HELPSIGN,
      P_OUT_RN         => :P_OUT_RN
    );
  end;`
    const params = db.createParams()
    params.add('P_FILTER_RN').dirIn().typeNumber().val(filter.rn)
    params.add('P_FILTER_NAME').dirIn().typeString().val(filter.name)
    params.add('P_CLAIM_NUMB').dirIn().typeString().val(filter.claimNumb)
    params.add('P_CLAIM_TYPE').dirIn().typeString().val(Array.isArray(filter.claimType) ? filter.claimType.join(';') : filter.claimType)
    params.add('P_CLAIM_STATUS').dirIn().typeString().val(Array.isArray(filter.claimStatus) ? filter.claimStatus.join(';') : filter.claimStatus)
    params.add('P_CLAIM_VERS').dirIn().typeString().val(Array.isArray(filter.claimVersion) ? filter.claimVersion.join(';') : filter.claimVersion)
    params.add('P_CLAIM_RELEASE').dirIn().typeString().val(Array.isArray(filter.claimRelease) ? filter.claimRelease.join(';') : filter.claimRelease)
    params.add('P_CLAIM_BUILD').dirIn().typeString().val(Array.isArray(filter.claimBuild) ? filter.claimBuild.join(';') : filter.claimBuild)
    params.add('P_CLAIM_UNIT').dirIn().typeString().val(filter.claimUnit)
    params.add('P_CLAIM_APP').dirIn().typeString().val(filter.claimApp)
    params.add('P_CLAIM_AUTHOR').dirIn().typeString().val(filter.claimAuthor)
    params.add('P_CLAIM_IM_INIT').dirIn().typeNumber().val(filter.imInitiator)
    params.add('P_CLAIM_EXEC').dirIn().typeString().val(filter.claimExecutor)
    params.add('P_CLAIM_IM_PERF').dirIn().typeNumber().val(filter.imExecutor)
    params.add('P_CLAIM_CONTENT').dirIn().typeString().val(filter.claimContent)
    params.add('P_CLAIM_HELPSIGN').dirIn().typeString().val(Array.isArray(filter.helpSign) ? filter.helpSign.join(';') : filter.helpSign)
    params.add('P_OUT_RN').dirOut().typeNumber()
    const result = (await db.execute(sessionID, sql, params)).outBinds
    res.send(200, { rn: result['P_OUT_RN'] })
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.get('/filters/my-list', getClaimConditionsList)
rest.get('/filters/get-one', getClaimConditionOne)
rest.post('/filters/save', saveClaimCondition)
rest.post('/filters/delete', deleteClaimCondition)
