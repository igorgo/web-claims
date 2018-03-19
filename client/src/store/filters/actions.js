import restClient from '../../plugins/restClient'

export const getFiltersList = async ({commit, rootState}) => {
  try {
    const res = await restClient.get('filters/my-list', {sessionID: rootState.auth.sessionID})
    commit('setFiltersList', res.data)
  } catch (e) {
  }
}

export const filtersListScrollTo = async ({commit}, pos) => {
  commit('filtersListScrollTo', pos)
}
