import restClient from '../../plugins/restClient'

export const logon = async ({ commit, dispatch, state }, { user, pass }) => {
  try {
    commit('clearError')
    const res = await restClient.post('auth/logon', { user, pass })
    commit('logOn', res.data)
    dispatch('staticData/getClaimStatuses', null, { root: true })
    dispatch('staticData/getAppList', null, { root: true })
    dispatch('staticData/getUnitList', null, { root: true })
  } catch (e) {
    commit('logOnError', e)
    throw e
  }

  // dispatch('dicts/getAccs', {}, { root: true })
  // router.back()
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