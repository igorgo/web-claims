const rest = require('../rest')
const db = require('../db')
const mailer = require('../mailer')
async function logonHandler (req, res, next) {
  const {user, pass} = req.params
  let result
  try {
    result = await db.logon(user, pass)
    const params = db.createParams()
    params.add('IS_PMO').dirOut().typeNumber()
    const env = await db.execute(result.sessionID, 'begin UDO_PACKAGE_NODEWEB_IFACE.SET_ENV(:IS_PMO); end;', params)
    result.isPmo = env['outBinds']['IS_PMO']
    res.send(200, result)
  } catch (e) {
    return next(new rest.errors.UnauthorizedError(e.message))
  }
}

async function logoffHandler (req, res) {
  const {sessionID} = req.params
  try {
    await db.logoff(sessionID)
    res.send(200, 'OK')
  } catch (e) {
    res.send(200, 'OK')
  }
}

async function validateHandler (req, res, next) {
  const {sessionID} = req.params
  try {
    const conn = await db.getConnection(sessionID)
    conn.close()
    res.send(200, 'OK')
  } catch (e) {
    return next(new rest.errors.UnauthorizedError(e.message))
  }
}

async function sendAuthApply (req, res, next) {
  try {
    const { userName, eMail, lastName, firstName, employer, surName } = req.params
    const sql = `
    begin
      UDO_PACKAGE_NODEWEB_IFACE.CHECK_NEW_USER(USERNAME => :USERNAME, EMAIL => :EMAIL, RESULT => :RESULT);
    end;
    `
    const params = db.createParams()
    params.add('USERNAME').dirIn().typeString().val(userName)
    params.add('EMAIL').dirIn().typeString().val(eMail)
    params.add('RESULT').dirOut().typeNumber()
    let result = (await db.executePub(sql, params)).outBinds['RESULT']
    if (result === 0) {
      const mailOptions = {
        from: 'metod8@afina.ua',
        to: 'metod8@afina.ua',
        subject: 'Заявка на реєстрацію в УДП',
        html: `
<table>
  <tr>
    <td>Ім'я користувача: </td><td>${userName}</td>
  </tr>      
  <tr>
    <td>Електронна адреса: </td><td>${eMail}</td>
  </tr>      
  <tr>
    <td>Призвище: </td><td>${lastName}</td>
  </tr>      
  <tr>
    <td>Ім'я: </td><td>${firstName}</td>
  </tr>      
  <tr>
    <td>По-батькові: </td><td>${surName}</td>
  </tr>      
  <tr>
    <td>Відділ центрального офісу, або назва ДП: </td><td>${employer}</td>
  </tr>      
</table>
  `
      }
      mailer.sendMail(mailOptions, function (error, info) {
        if (error) {
          result = 4
        } else {
          console.log(new Date(), 'Email sent: ' + info.response)
        }
      })
    }
    res.send(200, {check: result})
  } catch (e) {
    next(new rest.errors.InternalServerError(e.message))
  }
}

rest.post('/auth/send-reply', sendAuthApply)
rest.post('/auth/logon', logonHandler)
rest.post('/auth/logoff', logoffHandler)
rest.post('/auth/validate', validateHandler)
