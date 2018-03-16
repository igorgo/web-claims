import { SessionStorage } from 'quasar'

console.log(SessionStorage)

const savedAuthData = SessionStorage.has('authData') ? SessionStorage.get.item('authData') : {
  authError: '',
  authorized: false,
  userFullName: '',
  sessionID: '',
  userData: '',
  isPmo: false
}

export default {...savedAuthData}
