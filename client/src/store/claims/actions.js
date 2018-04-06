import Routines from '../../plugins/routines'
import restClient from '../../plugins/restClient'

export const setCurrentCondition = ({commit, dispatch}, value) => {
  dispatch('auth/setUserDataEntry', {type: 'N', key: 'LAST_COND', value}, { root: true })
  dispatch('sendClaimsRequest', true)
}

export const setCurrentSort = ({commit, dispatch}, value) => {
  dispatch('auth/setUserDataEntry', {key: 'CLAIM_SORT', type: 'N', value}, { root: true })
  dispatch('sendClaimsRequest', true)
}

export const sortToggle = ({commit, rootState, dispatch, getters}) => {
  dispatch('auth/setUserDataEntry', {key: 'CLAIM_SORT_ORDER', type: 'N', value: getters.isSortOrderDesc ? 0 : 1}, { root: true })
  dispatch('sendClaimsRequest', true)
}

export const sendClaimsRequest = async ({state, commit, rootState, getters}, discardPage = false) => {
  if (state.doNotUpdate) {
    commit('blockListUpdate', false)
    return
    // Events.$emit('claims:scroll:to:rec', { pos: state.claimRecordIndexActive })
  }
  commit('claimListReset')
  let sortStr = ''
  const currentClaimSort = getters.currentClaimSort
  if (currentClaimSort > 0) {
    sortStr = Routines.SORT_OPTIONS[currentClaimSort].field
    if (getters.isSortOrderDesc) sortStr += ' DESC'
  }
  const res = await restClient.post('/claims/find', {
    sessionID: getters.sessionID,
    conditionId: getters.currentCondition,
    sortOrder: sortStr,
    page: discardPage ? 1 : state.currentClaimPage,
    limit: getters.currentClaimLimit,
    newClaimId: state.newAddedClaimId
  })
  commit('auth/setUserDataEntry', {key: 'LIST_LIMIT', value: res.data.limit}, { root: true })
  commit('claimListGot', res.data)
  commit('setCurrentPage', res.data.page)
}

export const setCurrentPage = async ({dispatch, commit}, page) => {
  commit('setCurrentPage', page)
  await dispatch('sendClaimsRequest')
}

export const getClaimRecord = async ({commit, getters, dispatch}, id) => {
  commit('beforeGetRecord')
  const res = await restClient.post('/claims/find-one', {
    sessionID: getters.sessionID,
    id
  })
  commit('afterGetRecord', res.data)
  void dispatch('getClaimFiles', id)
  void dispatch('getClaimHistory', id)
  void dispatch('getClaimActions', id)
}

export const getClaimFiles = async ({getters, commit}, id) => {
  const res = await restClient.post('/claims/files', {
    sessionID: getters.sessionID,
    id
  }, false)
  commit('afterGetFiles', res.data)
}

export const getClaimHistory = async ({getters, commit}, id) => {
  const res = await restClient.post('/claims/history', {
    sessionID: getters.sessionID,
    id
  }, false)
  commit('afterGetHistory', res.data)
}

export const getClaimActions = async ({getters, commit}, id) => {
  const res = await restClient.post('/claims/actions', {
    sessionID: getters.sessionID,
    id
  }, false)
  commit('afterGetActionsMask', res.data)
}

export const viewNextClaim = async ({state, commit, dispatch}) => {
  let idx = state.activeRecordIndex
  if (state.activeRecordIndex < state.claimList.length - 1) {
    idx++
    commit('setActiveRecordIndex', idx)
    return state.claimList[idx].id
  } else if (state.currentClaimPage !== state.claimListPages) {
    await dispatch('setCurrentPage', state.currentClaimPage + 1)
    if (state.claimList.length) return state.claimList[idx].id
  } else return null
}

export const viewPrevClaim = async ({state, commit, dispatch}) => {
  let idx = state.activeRecordIndex
  if (state.activeRecordIndex > 0) {
    idx--
    commit('setActiveRecordIndex', idx)
    return state.claimList[idx].id
  } else if (state.currentClaimPage !== 1) {
    await dispatch('setCurrentPage', state.currentClaimPage - 1)
    idx = state.claimList.length - 1
    if (idx >= 0) {
      commit('setActiveRecordIndex', idx)
      return state.claimList[idx].id
    }
  } else return null
}
