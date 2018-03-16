import restClient from '../../plugins/restClient'

export const logon = async ({ commit, dispatch, state }, { user, pass }) => {
  try {
    commit('clearError')
    const res = await restClient.post('auth/logon', { user, pass })
    commit('logOn', res.data)
  } catch (e) {
    commit('logOnError', e)
    throw e
  }

  // dispatch('dicts/getAccs', {}, { root: true })
  // router.back()
}

export const logoff = async ({ commit, state }) => {
  await restClient.post('auth/logoff', { sessionID: state.sessionID })
  commit('logOff')
}
