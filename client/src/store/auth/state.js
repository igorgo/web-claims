import { SessionStorage } from 'quasar'

const savedAuthData = SessionStorage.has('authData') ? SessionStorage.get.item('authData') : {
  authError: '',
  authorized: false,
  userFullName: '',
  sessionID: '',
  userData: {
    'LAST_COND': null,
    'LIST_LIMIT': 25,
    'CLAIM_SORT': 2,
    'CLAIM_SORT_ORDER': 1
  },
  isPmo: false
}

export default {...savedAuthData}
