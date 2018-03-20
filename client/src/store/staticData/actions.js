import restClient from '../../plugins/restClient'

export const getClaimStatuses = async ({commit, rootState}) => {
  try {
    const res = await restClient.get('dicts/claim-statuses', { sessionID: rootState.auth.sessionID }, false)
    commit('setClaimStatuses', res.data)
  } catch (e) {
  }
}

export const getAppList = async ({commit, rootState}) => {
  try {
    const res = await restClient.get('dicts/app-list', { sessionID: rootState.auth.sessionID }, false)
    commit('setAppList', res.data)
  } catch (e) {
  }
}

export const getUnitList = async ({commit, rootState}) => {
  try {
    const res = await restClient.get('dicts/unit-list', { sessionID: rootState.auth.sessionID }, false)
    commit('setUnitList', res.data)
  } catch (e) {
  }
}

export const getBuildList = async ({commit, rootState}) => {
  try {
    const res = await restClient.get('dicts/build-list', { sessionID: rootState.auth.sessionID }, false)
    commit('setReleases', res.data)
  } catch (e) {
  }
}

export const getPersonList = async ({commit, rootState}) => {
  try {
    const res = await restClient.get('dicts/person-list', { sessionID: rootState.auth.sessionID }, false)
    commit('setPersons', res.data)
  } catch (e) {
  }
}
