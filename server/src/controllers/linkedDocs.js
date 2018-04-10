const rest = require('../rest')
const db = require('../db')
const { checkSession } = require('./checkAuth')
const MSG_READ_FILE_ERROR = 'Помилка отримання приєднаного файлу з бази даних'

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
      console.log(e)
      conn.close()
    }
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

async function uploadFile (req, res, next) {
  try {
    console.log(req.params)
    res.send(200, '')
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.post('/files/get-one', getFile)
rest.post('/files/upload/:filename', uploadFile)
