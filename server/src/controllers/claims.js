const rest = require('../rest')
const db = require('../db')
const { checkSession } = require('./checkAuth')

async function claimsFindOne (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id } = req.params
    const sql = `
      select trim(S01) as "claimPrefix",
             trim(S02) as "claimNumber",
             S03 as "claimType",
             S04 as "claimState",
             S05 as "registeredByAgent",
             S06 as "changedByAgent",
             S07 as "executor",
             S08 as "buildFrom",
             S09 as "buildToComb",
             S10 as "unit",
             S11 as "app",
             S12 as "action",
             S13 as "content",
             S14 as "relFrom",
             S15 as "relTo",
             S16 as "buildTo",
             N01 as "id",
             N02 as "priority",
             N03 as "helpSign",
             N04 as "claimTypeId",
             N05 as "exexGroupSign",
             D01 as "registeredAt",
             D02 as "changedAt",
             D03 as "execTill"
        from table(UDO_PACKAGE_NODEWEB_IFACE.GET_CLAIM_RECORD(:RN))
  `
    const params = db.createParams()
    params.add('RN').dirIn().typeNumber().val(id)
    const result = await db.execute(sessionID, sql, params)
    const response = result.rows.length ? result.rows[0] : { id: null }
    res.send(200, response)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

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

async function getFiles (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id } = req.params
    const params = db.createParams()
    params.add('RN').dirIn().typeNumber().val(id)
    const result = await db.execute(sessionID, `
      select S01 as "path",
             N01 as "id",
             N02 as "sizeBite",
             N03 as "own" 
        from table(UDO_PACKAGE_NODEWEB_IFACE.GET_CLAIM_FILES(:RN))`, params)
    res.send(200, {id, files: result.rows})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getHistory (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id } = req.params
    const params = db.createParams()
    params.add('RN').dirIn().typeNumber().val(id)
    const result = await db.execute(sessionID, `
    select D01 as "date",
           S03 as "who",
           S04 as "newStatus",
           S05 as "newExecutor",
           S06 as "comment",
           N02 as "noteId",
           N03 as "statusType"
      from table(UDO_PACKAGE_NODEWEB_IFACE.CLAIM_HISTORY(:RN))  
      `, params)
    res.send(200, {id, history: result.rows})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getActions (req, res, next) {
  try {
    checkSession(req)
    const {sessionID, id} = req.params
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    params.add('NACTIONMASK').dirOut().typeNumber()
    const result = await db.execute(sessionID, `
      begin
        UDO_PACKAGE_NODEWEB_IFACE.GET_AVAIL_ACTIONS(
          NRN         => :NRN,
          NACTIONMASK => :NACTIONMASK
        );
      end;
    `, params)
    res.send(200, {id, actionsMask: result.outBinds['NACTIONMASK']})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function addClaim (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, cType, cPriority, cSend, cInit, cApp, cUnit, cFunc, cContent, cRelFrom, cBldFrom, cRelTo } = req.params
    const sql = `
    begin
      UDO_PKG_CLAIMS.CLAIM_INSERT(
        NCRN                => null,
        SEVENT_TYPE         => :SEVENT_TYPE,
        SLINKED_CLAIM       => null,
        NPRIORITY           => :NPRIORITY,
        NSEND_TO_DEVELOPERS => :NSEND_TO_DEVELOPERS,
        SINIT_PERSON        => :SINIT_PERSON,
        SMODULE             => :SMODULE,
        SUNITCODE           => :SUNITCODE,
        SUNITFUNC           => :SUNITFUNC,
        SEVENT_DESCR        => :SEVENT_DESCR,
        SREL_FROM           => :SREL_FROM,
        SBUILD_FROM         => :SBUILD_FROM,
        SREL_TO             => :SREL_TO,
        NRN                 => :NRN
      );
    end;`
    const params = db.createParams()
    params.add('SEVENT_TYPE').dirIn().typeString().val(cType)
    params.add('NPRIORITY').dirIn().typeNumber().val(cPriority)
    params.add('NSEND_TO_DEVELOPERS').dirIn().typeNumber().val(cSend)
    params.add('SINIT_PERSON').dirIn().typeString().val(cInit)
    params.add('SMODULE').dirIn().typeString().val(cApp)
    params.add('SUNITCODE').dirIn().typeString().val(cUnit)
    params.add('SUNITFUNC').dirIn().typeString().val(cFunc)
    params.add('SEVENT_DESCR').dirIn().typeString().val(cContent)
    params.add('SREL_FROM').dirIn().typeString().val(cRelFrom)
    params.add('SBUILD_FROM').dirIn().typeString().val(cBldFrom)
    params.add('SREL_TO').dirIn().typeString().val(cRelTo)
    params.add('NRN').dirOut().typeNumber()
    const result = (await db.execute(sessionID, sql, params))
    res.send(200, {id: result.outBinds['NRN']})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function deleteClaim (req, res, next) {
  try {
    checkSession(req)
    const {sessionID, id} = req.params
    const sql = `
    begin
      UDO_PKG_CLAIMS.CLAIM_DELETE(NRN => :NRN);
    end;
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    await db.execute(sessionID, sql, params)
    res.send(204, null)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function editClaim (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, cId, cContent, cRelFrom, cBldFrom, cRelTo, cApp, cUnit, cFunc } = req.params
    const sql = `
    begin
      UDO_PKG_CLAIMS.CLAIM_UPDATE(
        NRN           => :NRN,
        SLINKED_CLAIM => null,
        SEVENT_DESCR  => :SEVENT_DESCR,
        SREL_FROM     => :SREL_FROM,
        SBUILD_FROM   => :SBUILD_FROM,
        SREL_TO       => :SREL_TO,
        SBUILD_TO     => null,
        SMODULE       => :SMODULE,
        SUNITCODE     => :SUNITCODE,
        SUNITFUNC     => :SUNITFUNC
      );
    end;`
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(cId)
    params.add('SEVENT_DESCR').dirIn().typeString().val(cContent)
    params.add('SREL_FROM').dirIn().typeString().val(cRelFrom)
    params.add('SBUILD_FROM').dirIn().typeString().val(cBldFrom)
    params.add('SREL_TO').dirIn().typeString().val(cRelTo)
    params.add('SMODULE').dirIn().typeString().val(cApp)
    params.add('SUNITCODE').dirIn().typeString().val(cUnit)
    params.add('SUNITFUNC').dirIn().typeString().val(cFunc)
    await db.execute(sessionID, sql, params)
    res.send(200, {id: cId})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getNextStatuses (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id } = req.params
    const sql = `
    select 
      S01 as "statCode",
      N01 as "statId",
      N02 as "statType"
    from table(UDO_PACKAGE_NODEWEB_IFACE.GET_NEXTPOINTS(:NRN))
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    const result = await db.execute(sessionID, sql, params)
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getPointExecutors (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id, pointId } = req.params
    const sql = `
    select 
      S01 as "value",
      S02 as "label"
    from table(UDO_PACKAGE_NODEWEB_IFACE.GET_NEXTPOINT_EXECUTORS(:NRN, :NPOINT))
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    params.add('NPOINT').dirIn().typeNumber().val(pointId)
    const result = await db.execute(sessionID, sql, params)
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function claimChangeStatus (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, cId, cType, cStatus, cSendTo, cNoteHeader, cNote, cPriority, cRelTo, cBldTo } = req.params
    const sql = `
    begin
      UDO_PKG_CLAIMS.CLAIM_CHANGE_STATE(
        NRN            => :NRN,
        SEVENT_TYPE    => :SEVENT_TYPE,
        SEVENT_STAT    => :SEVENT_STAT,
        SSEND_CLIENT   => null,
        SSEND_DIVISION => null,
        SSEND_POST     => null,
        SSEND_PERFORM  => null,
        SSEND_PERSON   => :SSEND_PERSON,
        SNOTE_HEADER   => :SNOTE_HEADER,
        SNOTE          => :SNOTE,
        NPRIORITY      => :NPRIORITY,
        SREL_TO        => :SREL_TO,
        SBUILD_TO      => :SBUILD_TO
      );
    end;
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(cId)
    params.add('SEVENT_TYPE').dirIn().typeString().val(cType)
    params.add('SEVENT_STAT').dirIn().typeString().val(cStatus)
    params.add('SSEND_PERSON').dirIn().typeString().val(cSendTo)
    params.add('SNOTE_HEADER').dirIn().typeString().val(cNoteHeader)
    params.add('SNOTE').dirIn().typeString().val(cNote)
    params.add('NPRIORITY').dirIn().typeNumber().val(cPriority)
    params.add('SREL_TO').dirIn().typeString().val(cRelTo)
    params.add('SBUILD_TO').dirIn().typeString().val(cBldTo)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getClaimRetMessage (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id } = req.params
    const sql = `
    begin
      UDO_PACKAGE_NODEWEB_IFACE.FIND_RETPOINT(
        NRN        => :NRN,
        NPOINT_OUT => :NPOINT_OUT,
        SCOMMENTRY => :SCOMMENTRY
      );
    end;
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    params.add('NPOINT_OUT').dirOut().typeNumber()
    params.add('SCOMMENTRY').dirOut().typeString(1000)
    const result = await db.execute(sessionID, sql, params)
    res.send(200, { message: result.outBinds['SCOMMENTRY'] })
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function claimReturn (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id, cNoteHeader, cNote } = req.params
    const sql = `
    begin
      UDO_PKG_CLAIMS.CLAIM_RETURN(
        NRN          => :NRN,
        SNOTE_HEADER => :SNOTE_HEADER,
        SNOTE        => :SNOTE
      );
    end;
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    params.add('SNOTE_HEADER').dirIn().typeString().val(cNoteHeader)
    params.add('SNOTE').dirIn().typeString().val(cNote)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function getClaimCurrentExecutors (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id } = req.params
    const sql = `
    select 
      S01 as "value",
      S02 as "label"
    from table(UDO_PACKAGE_NODEWEB_IFACE.GET_OTHER_EXECUTORS(:NRN))
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    const result = await db.execute(sessionID, sql, params)
    res.send(200, result.rows)
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function claimSendTo (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id, cType, cStatus, cSendTo, cNoteHeader, cNote } = req.params
    const sql = `
    begin
      UDO_PKG_CLAIMS.CLAIM_DO_SEND(
        NRN            => :NRN,
        SEVENT_TYPE    => :SEVENT_TYPE,
        SEVENT_STAT    => :SEVENT_STAT,
        SSEND_CLIENT   => null,
        SSEND_DIVISION => null,
        SSEND_POST     => null,
        SSEND_PERFORM  => null,
        SSEND_PERSON   => :SSEND_PERSON,
        SNOTE_HEADER   => :SNOTE_HEADER,
        SNOTE          => :SNOTE
     );
    end;
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    params.add('SEVENT_TYPE').dirIn().typeString().val(cType)
    params.add('SEVENT_STAT').dirIn().typeString().val(cStatus)
    params.add('SSEND_PERSON').dirIn().typeString().val(cSendTo)
    params.add('SNOTE_HEADER').dirIn().typeString().val(cNoteHeader)
    params.add('SNOTE').dirIn().typeString().val(cNote)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function claimAnull (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id } = req.params
    const sql = `
    begin
      UDO_PKG_CLAIMS.CLAIM_CLOSE(NRN => :NRN);
    end;`
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function claimComment (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id, cNoteHeader, cNote } = req.params
    const sql = `
    begin
      UDO_PACKAGE_NODEWEB_IFACE.ACT_ADD_NOTE(
        P_RN => :P_RN,
        P_NOTE_HEADER => :P_NOTE_HEADER,
        P_NOTE => :P_NOTE
      );
    end;
    `
    const params = db.createParams()
    params.add('P_RN').dirIn().typeNumber().val(id)
    params.add('P_NOTE_HEADER').dirIn().typeString().val(cNoteHeader)
    params.add('P_NOTE').dirIn().typeString().val(cNote)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function claimSetPriority (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id, priority } = req.params
    const sql = `
    begin
        UDO_PACKAGE_NODEWEB_IFACE.SET_PRIORITY(
          NRN => :NRN,
          NPRIORITY => :NPRIORITY
        );
      end;
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    params.add('NPRIORITY').dirIn().typeNumber().val(priority)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function claimHelpNeed (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id, status, note } = req.params
    const sql = `
    begin
        UDO_PKG_CLAIMS.CLAIM_HELPSIGN_NEED(
          NRN => :NRN,
          NSTATUS => :NSTATUS,
          SNOTE => :SNOTE
        );
      end;
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    params.add('NSTATUS').dirIn().typeNumber().val(status)
    params.add('SNOTE').dirIn().typeString().val(note)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function claimHelpStatus (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id, status } = req.params
    const sql = `
    begin
        UDO_PKG_CLAIMS.CLAIM_HELPSIGN_STAT(
          NRN => :NRN,
          NSTATUS => :NSTATUS
        );
      end;
    `
    const params = db.createParams()
    params.add('NRN').dirIn().typeNumber().val(id)
    params.add('NSTATUS').dirIn().typeNumber().val(status)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function ClameNoteUpdate (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id, note} = req.params
    const sql = `
    begin
        UDO_PACKAGE_NODEWEB_IFACE.ACT_EDIT_NOTE(
          P_RN => :P_RN,
          P_NOTE => :P_NOTE
        );
      end;
    `
    const params = db.createParams()
    params.add('P_RN').dirIn().typeNumber().val(id)
    params.add('P_NOTE').dirIn().typeString().val(note)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.post('/claims/note-update', ClameNoteUpdate)
rest.post('/claims/help-status', claimHelpStatus)
rest.post('/claims/help-need', claimHelpNeed)
rest.post('/claims/set-priority', claimSetPriority)
rest.post('/claims/comment', claimComment)
rest.post('/claims/anull', claimAnull)
rest.post('/claims/send-to', claimSendTo)
rest.post('/claims/curr-execs', getClaimCurrentExecutors)
rest.post('/claims/return', claimReturn)
rest.post('/claims/return-message', getClaimRetMessage)
rest.post('/claims/change-status', claimChangeStatus)
rest.post('/claims/next-execs', getPointExecutors)
rest.post('/claims/next-statuses', getNextStatuses)
rest.post('/claims/edit', editClaim)
rest.post('/claims/actions', getActions)
rest.post('/claims/add', addClaim)
rest.post('/claims/delete', deleteClaim)
rest.post('/claims/history', getHistory)
rest.post('/claims/files', getFiles)
rest.post('/claims/find', claimsFind)
rest.post('/claims/find-one', claimsFindOne)
