import restClient from '../../plugins/restClient'

export const getCurrentReleases = async ({ commit, dispatch, state }, force = false) => {
  if (force || !state.releasesLoaded) {
    commit('resetCurrentReleases')
    const res = await restClient.get('pub/current-releases', {}, false)
    commit('setCurrentReleases', res.data)
  }
}
