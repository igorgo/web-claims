import Routines from '../../plugins/routines'
import restClient from '../../plugins/restClient'

export const setCurrentCondition = ({commit}, value) => {
  commit('auth/setUserDataEntry', {key: 'LAST_COND', value}, { root: true })
  // todo: renew claims set
}

export const setCurrentSort = ({commit}, value) => {
  commit('auth/setUserDataEntry', {key: 'CLAIM_SORT', value}, { root: true })
  // todo: renew claims set
}

export const sortToggle = ({commit, rootState}) => {
  commit('auth/setUserDataEntry', {key: 'CLAIM_SORT_ORDER', value: !rootState.auth.userData['CLAIM_SORT_ORDER'] ? 1 : 0}, { root: true })
  // todo: renew claims set
}

export const sendClaimsRequest = async ({state, commit, rootState, getters}, discardPage = false) => {
  if (state.doNotUpdate) {
    commit('blockListUpdate', false)
    return
    // Events.$emit('claims:scroll:to:rec', { pos: state.claimRecordIndexActive })
  }
  commit('claimListReset')
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
