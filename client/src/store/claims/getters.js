export const currentCondition = (state, getters, rootState) => rootState.auth.userData['LAST_COND']

export const currentClaimSort = (state, getters, rootState) => rootState.auth.userData['CLAIM_SORT']

export const currentClaimLimit = (state, getters, rootState) => rootState.auth.userData['LIST_LIMIT']

export const isSortOrderDesc = (state, getters, rootState) => !!rootState.auth.userData['CLAIM_SORT_ORDER']

export const sessionID = (state, getters, rootState) => rootState.auth.sessionID

export const activeClaimRecord = (state, getters, rootState) => state.activeRecordIndex >= 0
  ? state.claimList[state.activeRecordIndex]
  : {}
