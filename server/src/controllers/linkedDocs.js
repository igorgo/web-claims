const rest = require('../rest')
const db = require('../db')
const { checkSession } = require('./checkAuth')
const MSG_READ_FILE_ERROR = 'Помилка отримання приєднаного файлу з бази даних'
const uniqid = require('uniqid')

async function getFile (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id } = req.params
    const sql = `
     begin
       UDO_PACKAGE_NODEWEB_IFACE.GET_LINKED_DOC(
         P_RN       => :RN,
         P_FILESIZE => :FILESIZE,
         P_FILENAME => :FILENAME,
         P_MIMETYPE => :MIMETYPE,
         P_DOCDATA  => :DOCDATA
       );
     end;`
    const params = db.createParams()
    params.add('RN').dirIn().typeNumber().val(parseInt(id))
    params.add('FILESIZE').dirOut().typeNumber()
    params.add('FILENAME').dirOut().typeString(1000)
    params.add('MIMETYPE').dirOut().typeString(1000)
    params.add('DOCDATA').dirOut().typeBlob()
    const conn = await db.getConnection(sessionID)
    try {
      const result = await db.execute(sessionID, sql, params, {}, conn)
      const file = result.outBinds['DOCDATA']
      const mimeType = result.outBinds['MIMETYPE']
      const fileName = result.outBinds['FILENAME']
      if (file === null) {
        conn.close()
        next(new rest.errors.InternalServerError(MSG_READ_FILE_ERROR))
        return
      }
      let chunks = []
      file.on('data', data => {
        chunks.push(data)
      })
      file.on('end', () => {
      })
      file.on('close', () => {
        const buf = Buffer.concat(chunks)
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(buf),
          'Content-Type': mimeType,
          'X-File-Name': Buffer.from(fileName).toString('base64')
        })
        res.write(buf)
        res.end()
        conn.close()
      })
    } catch (e) {
      console.log(new Date(), e)
      conn.close()
    }
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function uploadFile (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id, filename, file } = req.params
    console.log(new Date(), 'filename loaded:', Buffer.from(filename, 'base64').toString())
    const sql = `
    begin
      UDO_PACKAGE_NODEWEB_IFACE.ACT_ADD_DOC(
        P_RN       => :RN,
        P_CODE     => :CODE,
        P_FILENAME => :FILENAME,
        P_FILE     => :FILE
      );
    end;
  `
    const params = db.createParams()
    params.add('RN').dirIn().typeNumber().val(parseInt(id))
    params.add('CODE').dirIn().typeString().val(uniqid.process())
    params.add('FILENAME').dirIn().typeString().val(Buffer.from(filename, 'base64').toString())
    params.add('FILE').dirIn().typeBuffer().val(file)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function deleteFile (req, res, next) {
  try {
    checkSession(req)
    const { sessionID, id } = req.params
    const sql = `
    begin
      UDO_PACKAGE_NODEWEB_IFACE.ACT_DOC_DELETE(
        P_RN       => :RN
      );
    end;`
    const params = db.createParams()
    params.add('RN').dirIn().typeNumber().val(id)
    await db.execute(sessionID, sql, params)
    res.send(204, {})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.post('/files/get-one', getFile)
rest.post('/files/delete', deleteFile)
rest.post('/files/upload/:id/:filename', uploadFile)
