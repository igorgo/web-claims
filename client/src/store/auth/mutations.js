import { SessionStorage } from 'quasar'
function saveAuthData (data) {
  SessionStorage.set('authData', data)
}

export const logOn = (state, payload) => {
  state.authorized = true
  state.nCompany = payload.nCompany
  state.sessionID = payload.sessionID
  state.userFullName = payload.userFullName
  state.isPmo = !!payload.isPmo
  saveAuthData(state)
}

export const logOnError = (state, payload) => {
  state.authError = payload.message
  state.authorized = false
  state.nCompany = null
  state.sessionID = ''
  state.userFullName = ''
  state.isPmo = false
  saveAuthData(state)
}

export const logOff = (state) => {
  state.authorized = false
  state.nCompany = null
  state.sessionID = ''
  state.userFullName = ''
  state.isPmo = false
  saveAuthData(state)
}

export const clearError = (state) => {
  state.authError = ''
}