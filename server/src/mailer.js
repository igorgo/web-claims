const nodemailer = require('nodemailer')

const smtpConfig = {
  host: 'mail.afina.ua',
  port: 25,
  secure: false,
  // requireTLS: true,
  ignoreTLS: true,
  auth: {
    user: 'metod8',
    pass: 'Mx18s^4fW'
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
}

const defaultOpts = {
  from: 'metod8@afina.ua'
}

module.exports = nodemailer.createTransport(smtpConfig, defaultOpts)
