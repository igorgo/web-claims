const MSG_DONT_AUTHORIZED = 'Ви не авторизовані!'

module.exports = {
  checkSession: (req) => {
    if (!req.params.sessionID) {
      throw new Error(MSG_DONT_AUTHORIZED)
    }
  }
}
