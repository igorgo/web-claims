import { SessionStorage } from 'quasar'

export const blockListUpdate = (state, block) => {
  state.doNotUpdate = block
}

export const shiftActiveRecordIndex = (state, offset) => {
  let newIdx = state.activeRecordIndex + offset
  if (newIdx >= 0 && newIdx < state.claimList.length) state.activeRecordIndex = newIdx
}

export const setActiveRecordIndex = (state, index) => {
  state.activeRecordIndex = index
}

export const claimListGot = (state, data) => {
  state.newAddedClaimId = null
  state.claimList = data.claims
  state.allClaimsCount = data.allCnt
  state.claimListPages = Math.floor(data.allCnt / data.limit) + 1
  /* if (state.claimRecordIndexWait !== null) {
    Events.$emit(AE_CLAIMS_PAGE_SHIFTED, { idx: state.claimRecordIndexWait })
    state.claimRecordIndexWait = null
  }
  else {
    state.claimRecordIndexActive = state.claimList.length ? 0 : null
    Events.$emit(AE_CLAIMS_PAGE_LOADED)
  } */
  state.activeRecordIndex = data.claims.length ? 0 : null
}

export const claimListReset = (state) => {
  state.newAddedClaimId = null
  state.claimList = []
  state.allClaimsCount = 0
  state.activeRecordIndex = null
}

export const setCurrentPage = (state, page) => {
  state.currentClaimPage = page
  SessionStorage.set('currentClaimPage', page)
}
