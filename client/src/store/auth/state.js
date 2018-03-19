import { SessionStorage } from 'quasar'

const savedAuthData = SessionStorage.has('authData') ? SessionStorage.get.item('authData') : {
  authError: '',
  authorized: false,
  userFullName: '',
  sessionID: '',
  userData: '',
  isPmo: false
}

export default {...savedAuthData}
