/**
 * @type {oracledb}
 */
const oci = require('oracledb')
const _ = require('lodash')
const crypto = require('crypto')
const duration = require('go-duration')

// Constants
const SESSION_TIMEOUT_MINUTES = 480

/**
 * Oracle Bind Parameter
 */
class OraSqlParam {
  /**
   * Set the parameter's direction to IN
   * @returns {OraSqlParam} IN Param
   */
  dirIn () {
    this.dir = oci.BIND_IN
    return this
  }

  /**
   * Set the parameter's direction to OUT
   * @returns {OraSqlParam} OUT Param
   */
  dirOut () {
    this.dir = oci.BIND_OUT
    return this
  }

  /**
   * Set the parameter's direction to IN/OUT
   * @returns {OraSqlParam} IN/OUT Param
   */
  dirInOut () {
    this.dir = oci.BIND_INOUT
    return this
  }

  /**
   * Set the parameter's  datatype to NUMBER
   * @returns {OraSqlParam} number Param
   */
  typeNumber () {
    this.type = oci.NUMBER
    return this
  }

  /**
   * Set the parameter's  datatype to STRING
   * @param {number} [maxSize] max length of parameter. It's mandatory for OUT string params
   * @returns {OraSqlParam} varchar Param
   */
  typeString (maxSize) {
    this.type = oci.STRING
    if (maxSize) {
      this.maxSize = maxSize
    }
    return this
  }

  /**
   * Set the parameter's  datatype to DATE
   * @returns {OraSqlParam} date Param
   */
  typeDate () {
    this.type = oci.DATE
    return this
  }

  /**
   * Set the parameter's  datatype to CLOB
   * @returns {OraSqlParam} clob Param
   */
  typeClob () {
    this.type = oci.CLOB
    return this
  }

  /**
   * Set the parameter's  datatype to BLOB
   * @returns {OraSqlParam} blob Param
   */
  typeBlob () {
    this.type = oci.BLOB
    return this
  }

  /**
   * Set the parameter's  datatype to BUFFER
   * @returns {OraSqlParam} buffer Param
   */
  typeBuffer (maxSize) {
    this.type = oci.BUFFER
    if (maxSize) {
      this.maxSize = maxSize
    }
    return this
  }

  /**
   * Set the parameter's  value
   * @param {*} value The Param's Value
   * @returns {OraSqlParam} Param with value
   */
  val (value) {
    this.val = value
    return this
  }

  /**
   * Set the parameter's  value
   * @param {string} value The Param's Value
   * @returns {OraSqlParam} Param with value
   */
  sVal (value) {
    this.val = value
    return this
  }

  /**
   * Set the number parameter's  value
   * @param {string} value The Param's Value
   * @returns {OraSqlParam} Param with value
   */
  nVal (value) {
    this.val = parseInt(value, 10)
    return this
  }

  /**
   * Set the date parameter's  value
   * @param {string} value The Param's Value
   * @returns {OraSqlParam} Param with value
   */
  dVal (value) {
    const b = value.split(/\D+/)
    this.val = new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]))
    return this
  }
}

/**
 * Oracle Bind Parameters Collection
 */
class OraSqlParams {
  /**
   * Add parameter to collection
   * @param {string} name The Param's name
   * @returns {OraSqlParam} Added parameter
   */
  add (name) {
    const param = new OraSqlParam()
    _.set(this, name, param)
    return param
  }
}

class AfinaSequelDb {
  constructor ({host, port, database, schema, oldPkgSess, username, password, scompany, module, pubUser, pubPassword}) {
    if (!host) throw new Error('Db host is undefined')
    this.isOpened = false
    this.schema = schema
    this.oldPkgSess = oldPkgSess
    this.username = username
    this.password = password
    this.scompany = scompany
    this.module = module
    this.conectionString = host + ':' + port + '/' + database
    this.pool = {}
    this.pubSessionActive = false
    this.pubSessionID = ''
    this.pubUser = pubUser
    this.pubPassword = pubPassword
  }

  async __pubLogon () {
    this.pubSessionActive = false
    try {
      const cLogInfo = await this.logon(this.pubUser, this.pubPassword)
      this.pubSessionID = cLogInfo.sessionID
      this.pubSessionActive = true
      this.pubSessionTimer = setInterval(
        this.pubKeepAlive,
        duration('30m')
      )
      console.log('Public session started')
    } catch (e) {
      console.log('Public session not started')
      console.error(e)
    }
  }

  pubKeepAlive () {
    if (!this.pubSessionActive) return
    this.getConnectionPub().then((c) => {
      c.close()
    })
  }

  async getConnectionPub () {
    return this.getConnection(this.pubSessionID)
  }

  async open () {
    if (this.isOpened) return
    console.log('Opening the database…')
    oci.outFormat = oci.OBJECT
    oci.maxRows = 10000
    oci.fetchAsString = [oci.CLOB]
    oci.autoCommit = true
    this.pool = await oci.createPool({
      user: this.username,
      password: this.password,
      connectString: this.conectionString,
      poolMax: 16,
      poolTimeout: 20
    })
    this.isOpened = true
    console.log('The database is open')
    await this.__pubLogon()
  }

  /**
   * @return OraSqlParams
   */
  createParams () {
    return new OraSqlParams()
  }

  async close () {
    if (!this.isOpened) return
    await this.pool.terminate()
    this.isOpened = false
    console.log('The database is closed')
    if (this.pubSessionActive) {
      clearInterval(this.pubSessionTimer)
      await this.logoff(this.pubSessionID)
      console.log('The public session is closed')
    }
  }

  /**
   * Creates connection, sets the session schema, and changes session context to session utilizer
   * @param {string} aSessionId Afina Sequel Session ID
   * @returns {Promise.<oracledb.Connection>} Connection object is obtained by a Pool
   */
  async getConnection (aSessionId) {
    if (!this.isOpened) await this.open()
    const lConnection = await this.pool.getConnection()
    await lConnection.execute(`alter session set CURRENT_SCHEMA = ${this.schema}`)
    await lConnection.execute('begin PKG_SESSION.VALIDATE_WEB(SCONNECT => :SCONNECT); end;', [aSessionId])
    return lConnection
  }

  /**
   * Executes a statement
   * @param {string} aSessionId An Afina Sequel Session ID
   * @param {string} aSql The SQL string that is executed. The SQL string may contain bind parameters.
   * @param {OraSqlParams|Array} [aBindParams] Definintion and values of the bind parameters.
   * It's needed if there are bind parameters in the SQL statement
   * @param {{}|oracledb.IExecuteOptions} [aExecuteOptions] Execution options o control statement execution,
   * such a fetchInfo, outFormat etc.
   * @param {oracledb.Connection} [aConnection] Existing connection. If it is set, then connection won't be closed,
   * if not set the new connection will be open and will be closed after execution
   * @returns {Promise.<oracledb.IExecuteReturn>} The result Object. See https://github.com/oracle/node-oracledb/blob/master/doc/api.md#-result-object-properties
   */
  async execute (aSessionId, aSql, aBindParams = [], aExecuteOptions = {}, aConnection = null) {
    // eslint-disable-next-line no-unneeded-ternary
    const lConnection = aConnection ? aConnection : (await this.getConnection(aSessionId))
    try {
      return await lConnection.execute(aSql, aBindParams, aExecuteOptions)
    } catch (e) {
      console.error(e)
      throw e
    } finally {
      aConnection || await lConnection.close()
    }
  }

  /**
   * Logon to AfinaSql by utilizer
   * @param {string} aUser user name
   * @param {string} aPassword user web password
   * @returns {Promise.<Object>} New user session information
   * @property {number} nCompany Session company RN
   * @property {string} userFullName Session user full name
   * @property {string} appName Afina application name
   * @property {string} sCompanyName Session company name
   * @property {string} sessionID  An Afina Sequel Session ID
   */
  async logon (aUser, aPassword) {
    const lSessionId = (crypto.randomBytes(24)).toString('hex')
    const sqlLogon =
      `begin
       PKG_SESSION.LOGON_WEB(SCONNECT        => :SCONNECT,
                             SUTILIZER       => :SUTILIZER,
                             SPASSWORD       => :SPASSWORD,
                             SIMPLEMENTATION => :SIMPLEMENTATION,
                             SAPPLICATION    => :SAPPLICATION,
                             SCOMPANY        => :SCOMPANY,
                             ${!this.oldPkgSess ? 'SBROWSER        => :SBROWSER,' : ''}
                             SLANGUAGE       => :SLANGUAGE);
     end;`
    const paramsLogin = this.createParams()
    paramsLogin.add('SCONNECT').val(lSessionId)
    paramsLogin.add('SUTILIZER').val(aUser)
    paramsLogin.add('SPASSWORD').val(aPassword)
    paramsLogin.add('SIMPLEMENTATION').val(this.module)
    paramsLogin.add('SAPPLICATION').val(this.module)
    paramsLogin.add('SCOMPANY').val(this.scompany)
    paramsLogin.add('SLANGUAGE').val('RUSSIAN')
    !this.oldPkgSess && paramsLogin.add('SBROWSER').val('NODE-DRIVER')
    const sqlTimeout = 'begin PKG_SESSION.TIMEOUT_WEB(:CONNECT, :TIMEOUT); end;'
    const paramsTimeout = this.createParams()
    paramsTimeout.add('CONNECT').val(lSessionId)
    paramsTimeout.add('TIMEOUT').typeNumber().val(SESSION_TIMEOUT_MINUTES)
    const sqlInfo =
      `select 
        PKG_SESSION.GET_COMPANY(0) as NCOMPANY, 
        PKG_SESSION.GET_UTILIZER_NAME() as SFULLUSERNAME, 
        PKG_SESSION.GET_APPLICATION_NAME(0) as SAPPNAME, 
        PKG_SESSION.GET_COMPANY_FULLNAME(0) as SCOMPANYFULLNAME 
    from dual`
    if (!this.isOpened) await this.open()
    const lConnection = await this.pool.getConnection()
    await lConnection.execute(`alter session set CURRENT_SCHEMA = ${this.schema}`)
    try {
      await lConnection.execute(sqlLogon, paramsLogin, {})
      await lConnection.execute(sqlTimeout, paramsTimeout, {})
      const resultInfo = (await lConnection.execute(sqlInfo, {}, {})).rows[0]
      const result = {
        sessionID: lSessionId,
        nCompany: resultInfo['NCOMPANY'],
        sCompanyName: resultInfo['SCOMPANYFULLNAME'],
        userFullName: resultInfo['SFULLUSERNAME'],
        appName: resultInfo['SAPPNAME']
      }
      let authMessage = 'Session started:'
      authMessage += '\n\tseesion ID: ' + lSessionId
      authMessage += '\n\tuser      : ' + resultInfo['SFULLUSERNAME']
      console.info(authMessage)
      return result
    } finally {
      await lConnection.close()
    }
  }

  /**
   * Logs off from AfinaSql
   * @param {string} aSessionId An Afina Sequel Session ID
   * @returns {Promise.<number>} 0 if no errors, -1 if some error occurs
   */
  async logoff (aSessionId) {
    try {
      await this.execute(aSessionId, 'begin PKG_SESSION.LOGOFF_WEB(SCONNECT => :SCONNECT); end;', [aSessionId])
      let authMessage = 'Session finished:'
      authMessage += '\n\tsession ID: ' + aSessionId
      console.info(authMessage)
    } catch (e) {
      console.warn('Attempt logoff from non logged session')
    }
  }

  oraErrorExtract (msg) {
    const messages = msg.split(/ORA-\d\d\d\d\d:\s/)
    if (messages.length > 1) return messages[1]
    else return msg
  }
}

module.exports = AfinaSequelDb
