import restClient from '../../plugins/restClient'

export const logon = async ({ commit, dispatch, state }, { user, pass }) => {
  try {
    commit('clearError')
    const logonReq = await restClient.post('auth/logon', { user, pass })
    commit('logOn', logonReq.data)
    dispatch('staticData/getClaimStatuses', null, { root: true })
    dispatch('staticData/getAppList', null, { root: true })
    dispatch('staticData/getUnitList', null, { root: true })
    dispatch('staticData/getBuildList', null, { root: true })
    dispatch('staticData/getPersonList', null, { root: true })
  } catch (e) {
    commit('logOnError', e)
    throw e
  }
}

export const loadUserData = async ({state, commit}) => {
  try {
    const userDataReq = await restClient.get('userdata', { sessionID: state.sessionID })
    commit('userDataLoaded', userDataReq.data)
  } catch (e) {
    throw e
  }
}

export const logoff = async ({ commit, state }) => {
  try {
    await restClient.post('auth/logoff', { sessionID: state.sessionID })
  } catch (e) {
  } finally {
    commit('logOff')
    commit('staticData/resetStaticData', null, { root: true })
  }
}
